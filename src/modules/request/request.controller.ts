import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { RequestService } from "./request.service";
import { JwtAuthGuard } from "../jwt/guards/jwt-auth.guard";
import { ValidateCreateRequestPipe } from "./pipes/validate-create-request.pipe";
import { CreateRequestDto } from "./dto/create-request.dto";

@Controller("request")
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidateCreateRequestPipe())
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestService.createRequest(createRequestDto);
  }

  @Get("/all/:currentPage")
  @UseGuards(JwtAuthGuard)
  findAll(@Param("currentPage") currentPage: number) {
    return this.requestService.findAllRequests(currentPage);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.requestService.findOne(+id);
  }

  @Post("/assign/:token")
  @UseGuards(JwtAuthGuard)
  asign(@Param("token") token: string) {
    return this.requestService.assignRequestToTechEmployee(token);
  }

  @Post("/assign-help-desk/:token")
  @UseGuards(JwtAuthGuard)
  asignToHelpDesk(@Param("token") token: string) {
    return this.requestService.assignRequestToHelpDesk(token);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
  //   return this.requestService.updateStateRequest(+id, updateRequestDto);
  // }
}
