import { CreateCat, DeleteCat, FindCats, FindOneCat } from '@application';

import { Cat } from '@domain/entity';
import { UsecasesModule } from '@infra';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCatDTO } from '../../dto';

@Controller('cats')
@ApiTags('cats')
export class CatsHttpController {
  constructor(
    @Inject(UsecasesModule.CREATE_CAT) private readonly createCat: CreateCat,
    @Inject(UsecasesModule.GET_CAT) private readonly getCat: FindOneCat,
    @Inject(UsecasesModule.FIND_CATS) private readonly findCat: FindCats,
    @Inject(UsecasesModule.DELETE_CAT) private readonly deleteCat: DeleteCat,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cat' })
  async create(@Body() createCatDto: CreateCatDTO): Promise<Cat> {
    return this.createCat.execute(createCatDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cat by id' })
  async findOne(@Param('id') id: string): Promise<Cat> {
    return this.getCat.execute(id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats' })
  async find(): Promise<Cat[]> {
    return this.findCat.execute();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cat by id' })
  async delete(@Param('id') id: string) {
    return this.deleteCat.execute(id);
  }
}
