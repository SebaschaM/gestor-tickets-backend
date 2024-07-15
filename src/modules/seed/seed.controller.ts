import { Controller, Get, Param } from "@nestjs/common";
import { SeedService } from "./seed.service";

@Controller("seed")
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get("type-requests")
  findTypesRequest() {
    return this.seedService.findTypesRequest();
  }

  @Get("type-families")
  findTypesFamily() {
    return this.seedService.findTypesFamily();
  }

  @Get("type-services/:idFamily")
  findTypesService(@Param('idFamily') idFamily: string) {
    return this.seedService.findTypesService(idFamily);
  }
}
