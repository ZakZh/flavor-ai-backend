import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
  RateRecipeDto,
  CreateRecipeNoteDto,
} from './dto/recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private prisma: DatabaseService) {}

  async create(createRecipeDto: CreateRecipeDto, authorId: number) {
    return this.prisma.recipe.create({
      data: {
        ...createRecipeDto,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [recipes, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          ratings: {
            select: {
              id: true,
              rating: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    // Calculate average ratings for each recipe
    const recipesWithRatings = recipes.map((recipe) => {
      const averageRating =
        recipe.ratings.length > 0
          ? recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            recipe.ratings.length
          : 0;

      return {
        ...recipe,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingsCount: recipe.ratings.length,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: recipesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        ratings: {
          select: {
            id: true,
            rating: true,
            userId: true,
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    // Calculate average rating
    const averageRating =
      recipe.ratings.length > 0
        ? recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
          recipe.ratings.length
        : 0;

    return {
      ...recipe,
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingsCount: recipe.ratings.length,
    };
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, userId: number) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingRecipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (existingRecipe.authorId !== userId) {
      throw new ForbiddenException('You can only update your own recipes');
    }

    return this.prisma.recipe.update({
      where: { id },
      data: updateRecipeDto,
      include: {
        author: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number) {
    const existingRecipe = await this.prisma.recipe.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!existingRecipe) {
      throw new NotFoundException('Recipe not found');
    }

    if (existingRecipe.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own recipes');
    }

    return this.prisma.recipe.delete({
      where: { id },
    });
  }

  async findByUser(
    userId: number,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { authorId: userId };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [recipes, total] = await Promise.all([
      this.prisma.recipe.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          ratings: {
            select: {
              id: true,
              rating: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.recipe.count({ where }),
    ]);

    // Calculate average ratings for each recipe
    const recipesWithRatings = recipes.map((recipe) => {
      const averageRating =
        recipe.ratings.length > 0
          ? recipe.ratings.reduce((sum, rating) => sum + rating.rating, 0) /
            recipe.ratings.length
          : 0;

      return {
        ...recipe,
        averageRating: parseFloat(averageRating.toFixed(1)),
        ratingsCount: recipe.ratings.length,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: recipesWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async rateRecipe(
    recipeId: number,
    userId: number,
    rateRecipeDto: RateRecipeDto,
  ) {
    try {
      const recipe = await this.prisma.recipe.findUnique({
        where: { id: recipeId },
      });
      if (!recipe) {
        throw new NotFoundException('Recipe not found');
      }

      // Upsert rating (create or update)
      const result = await this.prisma.rating.upsert({
        where: {
          userId_recipeId: {
            userId,
            recipeId,
          },
        },
        update: {
          rating: rateRecipeDto.rating,
        },
        create: {
          rating: rateRecipeDto.rating,
          userId,
          recipeId,
        },
      });

      // Calculate new average rating
      const ratings = await this.prisma.rating.findMany({
        where: { recipeId },
      });

      const averageRating =
        ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

      return {
        message: 'Recipe rated successfully',
        averageRating,
        ratingsCount: ratings.length,
      };
    } catch (error) {
      throw error;
    }
  }

  async addNote(
    recipeId: number,
    userId: number,
    createNoteDto: CreateRecipeNoteDto,
  ) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const note = await this.prisma.recipeNote.upsert({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
      update: {
        content: createNoteDto.content,
        updatedAt: new Date(),
      },
      create: {
        content: createNoteDto.content,
        userId,
        recipeId,
      },
    });

    return note;
  }

  async getUserNote(recipeId: number, userId: number) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    if (!recipe) {
      throw new NotFoundException('Recipe not found');
    }

    const note = await this.prisma.recipeNote.findUnique({
      where: {
        userId_recipeId: {
          userId,
          recipeId,
        },
      },
    });

    return note;
  }
}
