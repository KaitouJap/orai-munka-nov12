import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { Sutemeny } from './sutemeny';
import { CreateSutemenyDto } from './create-sutemeny.dto';
import { UpdateSutemenyDto } from './update-sutemeny.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  sutik: Sutemeny[] = [
    {
      id: 1,
      nev: 'Tiramisu',
      laktozMentes: true,
      db: 5,
    },
    {
      id: 2,
      nev: 'Dobostorta',
      laktozMentes: true,
      db: 0,
    },
    {
      id: 4,
      nev: 'Krémes',
      laktozMentes: false,
      db: 1,
    },
  ];
  nextID = 5;

  @Get('sutik')
  sutemenyekListazas(){
    return this.sutik;
  }

  @Get('sutik/:sutiid')
  sutemenyIdAlapjan(@Param('sutiid') id: string){
    const suti = this.sutik.find(suti => suti.id == parseInt(id));
    if(!suti){
      throw new NotFoundException("Nincs ilyen ID-jű süti");
    }
    return suti;
  }

  @Delete('sutik/:sutiid')
  sutiTorles(@Param('sutiid') id: string){
    const idx = this.sutik.findIndex(suti => suti.id == parseInt(id));
    if(idx == -1){
      throw new BadRequestException("Nem letezik a suti amit torolni szeretnel!");
    }
    
    return this.sutik.splice(idx,1);
  }

  @Get('sutiKereses')
  sutemenyKereses(@Query('kereses') kereses?: string){
    if(!kereses) return this.sutik;

    return this.sutik.filter(suti => suti.nev.toLocaleLowerCase().includes(kereses.toLocaleLowerCase()));
  }

  @Post('ujSuti')
  ujsuti(@Body() ujSutiAdatok: CreateSutemenyDto){
    const ujSutemeny: Sutemeny = {
      ...ujSutiAdatok,
      id: this.nextID++,
    }

    this.sutik.push(ujSutemeny);
    return ujSutemeny;
  }

  @Patch('sutiModositas/:sutiid')
  sutiModositas(@Param('sutiid') id: string, @Body() sutiAdatok: UpdateSutemenyDto) {
    const eredetiSutiID = this.sutik.findIndex(suti => suti.id == parseInt(id));
    if(eredetiSutiID == -1) throw new NotFoundException("Nem letezik ez a suti!");
    
    const eredetiSuti = this.sutik[eredetiSutiID];
    const ujsuti: Sutemeny = {
      ...eredetiSuti,
      ...sutiAdatok,
    }

    this.sutik[eredetiSutiID] = ujsuti;
    return ujsuti;
  }

  @Get('abc')
  abcSorrend(){
    return this.sutik.toSorted((suti1, suti2) => 
      suti1.nev.toLocaleLowerCase().localeCompare(suti2.nev.toLocaleLowerCase()));
  }

  @Get('keszleten')
  keszleten(){
    return this.sutik.filter(suti => suti.db != 0);
  }

  @Post('ujSutiGyors')
  ujSutiGyors(@Body() ujSutiAdatok: CreateSutemenyDto){

    const ujSuti: Sutemeny = {
      ...ujSutiAdatok,
      laktozMentes: false,
      db: 1,
      id: this.nextID++,
    };

    this.sutik.push(ujSuti);
    return 'Uj sutemeny letrehozva!';
  }
}
