import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import {
  CreateRecipeDto,
  UpdateRecipeDto,
  RateRecipeDto,
  CreateRecipeNoteDto,
} from './dto/recipe.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRecipeDto: CreateRecipeDto, @Request() req: any) {
    return this.recipeService.create(createRecipeDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.recipeService.findAll(pageNum, limitNum, search);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-recipes')
  findMyRecipes(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.recipeService.findByUser(
      req.user.id,
      pageNum,
      limitNum,
      search,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Request() req: any,
  ) {
    return this.recipeService.update(id, updateRecipeDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.recipeService.remove(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rate')
  rateRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body() rateRecipeDto: RateRecipeDto,
    @Request() req: any,
  ) {
    return this.recipeService.rateRecipe(id, req.user.id, rateRecipeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/notes')
  addNote(
    @Param('id', ParseIntPipe) id: number,
    @Body() createRecipeNoteDto: CreateRecipeNoteDto,
    @Request() req: any,
  ) {
    return this.recipeService.addNote(id, req.user.id, createRecipeNoteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/notes')
  getUserNote(@Param('id', ParseIntPipe) id: number, @Request() req: any) {
    return this.recipeService.getUserNote(id, req.user.id);
  }
}
