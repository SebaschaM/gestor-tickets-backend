import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { convertToLocalTime } from "../../utils/convertToLocalTime";
import { generateTicket } from "src/utils/generateTicket";
import { ResponseDto } from "./dto/response.dto";
import { EmailService } from "../email/email.service";
import { CreateRequestDto } from "./dto/create-request.dto";
import { generateTokenEmailButton } from "src/utils/generateTokenEmailButton";
import { randomInt } from "crypto";

@Injectable()
export class RequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService
  ) {}

  async createRequest(
    createRequestDto: CreateRequestDto
  ): Promise<ResponseDto> {
    try {
      const {
        nombre_tipo_familia,
        asunto_solicitud,
        detalle_solicitud,
        fecha_asignada,
        usuario_id,
        tipo_solicitud_id,
        nombre_tipo_solicitud,
        tipo_servicio_id,
        nombre_tipo_servicio,
        tipo_estado_id,
        tipo_prioridad_id,
      } = createRequestDto;

      const now = new Date();
      const ticketRandomNum = generateTicket();
      const tokenEmailButton = generateTokenEmailButton();

      if (usuario_id !== 1) {
        throw new Error("Usuario no autorizado");
      }

      const solicitud = await this.prisma.solicitud.create({
        data: {
          numero_ticket: ticketRandomNum,
          token: tokenEmailButton,
          asunto_solicitud,
          detalle_solicitud,
          fecha_asignada: fecha_asignada ? new Date(fecha_asignada) : null,
          usuario_id,
          tipo_solicitud_id,
          tipo_servicio_id,
          tipo_estado_id,
          tipo_prioridad_id,
          fecha_creacion: convertToLocalTime(now),
          fecha_modificacion: convertToLocalTime(now),
        },
      });

      await this.prisma.solicitudUsuario.create({
        data: {
          solicitud_id: solicitud.solicitud_id,
          usuario_id,
        },
      });

      await this.emailService.sendRequestNotification(
        "mesapartesgobpe@gmail.com",
        asunto_solicitud,
        {
          asunto_solicitud,
          detalle_solicitud,
          token: tokenEmailButton,
          numero_ticket: ticketRandomNum,
          nombre_tipo_solicitud,
          nombre_tipo_servicio,
          nombre_tipo_familia,
          url_frontend: process.env.FRONTEND_URL,
        }
      );

      return {
        statusCode: 201,
        message: "Solicitud creada exitosamente",
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al crear la solicitud",
      };
    }
  }

  async findAllRequests(currentPage: number) {
    try {
      const requestsPerPage = 10;

      const requests = await this.prisma.solicitud.findMany({
        skip: (currentPage - 1) * requestsPerPage,
        take: requestsPerPage,
        include: {
          tipo_solicitud: true,
          tipo_servicio: true,
          tipo_estado: true,
          tipo_prioridad: true,
          solicitud_usuario: {
            select: {
              usuario_id: true,
              usuario: {
                select: {
                  nombre_usuario: true,
                },
              },
            },
          },
        },
        orderBy: {
          fecha_creacion: "desc",
        },
      });

      // Filtrar los solicitud_usuario que no tienen usuario_id igual a 1
      const filteredRequests = requests.map((request) => {
        return {
          ...request,
          solicitud_usuario: request.solicitud_usuario.filter(
            (usuario) => usuario.usuario_id !== 1
          ),
        };
      });

      const totalRequests = await this.prisma.solicitud.count();
      const totalPages = Math.ceil(totalRequests / requestsPerPage);

      return {
        statusCode: 200,
        message: "Solicitudes obtenidas exitosamente",
        data: filteredRequests,
        totalPages,
        requestsPerPage,
        currentPage: Number(currentPage),
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al obtener las solicitudes",
      };
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} request`;
  }

  async changeRequestStatus(token: string, status: number) {
    try {
      if (!token) {
        throw new Error("Token no proporcionado");
      }

      const isToken = await this.prisma.solicitud.findUnique({
        where: { token },
      });

      if (!isToken) {
        throw new Error("Token no encontrado");
      }

      await this.prisma.solicitud.update({
        where: { token },
        data: {
          tipo_estado_id: status,
          fecha_asignada: convertToLocalTime(new Date()),
        },
      });

      return {
        statusCode: 200,
        message: "Estado de la solicitud actualizado exitosamente",
      };
    } catch (error) {
      return {
        statusCode: 500,
        message:
          error.message || "Error al actualizar el estado de la solicitud",
      };
    }
  }

  async getEmployeesTech(token: string) {
    try {
      if (!token) {
        throw new Error("Token no proporcionado");
      }

      const solicitud = await this.prisma.solicitud.findUnique({
        where: { token },
        include: {
          tipo_servicio: {
            include: {
              tipo_familia: {
                include: {
                  perfil_tecnico: {
                    include: {
                      tipo_perfil_tecnico: {
                        include: {
                          rol_tipo_perfil_tecnico: {
                            include: {
                              rol: {
                                include: {
                                  usuarios: {
                                    include: {
                                      empleados: true,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!solicitud) {
        throw new Error("Solicitud no encontrada");
      }

      const empleados =
        solicitud.tipo_servicio.tipo_familia.perfil_tecnico.flatMap((pt) =>
          pt.tipo_perfil_tecnico.rol_tipo_perfil_tecnico.flatMap((rtp) =>
            rtp.rol.usuarios.flatMap((u) => u.empleados)
          )
        );

      return empleados;
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al obtener los empleados",
      };
    }
  }

  async assignRequestToTechEmployee(token: string) {
    try {
      if (!token) {
        throw new Error("Token no proporcionado");
      }

      const isToken = await this.prisma.solicitud.findUnique({
        where: { token },
      });

      const isAsigned = await this.prisma.solicitud.findFirst({
        where: { token, tipo_estado_id: 2 },
      });

      if (isAsigned !== null) {
        throw new Error("Solicitud ya asignada a un empleado");
      }

      if (!isToken) {
        throw new Error("Token no encontrado");
      }

      const empleados = await this.getEmployeesTech(token);

      if (!Array.isArray(empleados)) {
        throw new Error("Error al obtener los empleados");
      }

      if (empleados.length === 0) {
        throw new Error("No se encontraron empleados para la solicitud");
      }

      const longitud = empleados.length;

      const randomIndex = await randomInt(0, longitud);
      const empleadoSeleccionado = empleados[randomIndex];

      if (empleadoSeleccionado.usuario_id === 1) {
        throw new Error("Usuario no autorizado");
      }

      const solicitudUsuario = await this.prisma.solicitudUsuario.findFirst({
        where: { solicitud_id: isToken.solicitud_id },
      });

      if (solicitudUsuario.usuario_id != 1) {
        throw new Error("Solicitud ya asignada a un empleado");
      }

      await this.prisma.solicitudUsuario.create({
        data: {
          solicitud_id: isToken.solicitud_id,
          usuario_id: empleadoSeleccionado.usuario_id,
        },
      });

      await this.changeRequestStatus(token, 2);

      return {
        statusCode: 200,
        message: "Solicitud asignada exitosamente a un empleado",
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || "Error al asignar la solicitud",
      };
    }
  }

  async getEmployeesHelpDesk() {
    try {
      const empleados = await this.prisma.usuario.findMany({
        where: { rol_id: 2 },
        include: {
          empleados: true,
        },
      });

      return empleados;
    } catch (error) {
      return {
        statusCode: 500,
        message: "Error al obtener los empleados",
      };
    }
  }

  async assignRequestToHelpDesk(token: string) {
    try {
      if (!token) {
        throw new Error("Token no proporcionado");
      }

      const isToken = await this.prisma.solicitud.findUnique({
        where: { token },
      });

      if (!isToken) {
        throw new Error("Token no encontrado");
      }

      const helpDesk = await this.getEmployeesHelpDesk();

      if (!Array.isArray(helpDesk)) {
        throw new Error("Error al obtener los empleados");
      }

      if (helpDesk.length === 0) {
        throw new Error("No se encontraron empleados para la solicitud");
      }

      const longitud = helpDesk.length;

      const randomIndex = await randomInt(0, longitud);

      const empleadoSeleccionado = helpDesk[randomIndex];

      if (empleadoSeleccionado.usuario_id === 1) {
        throw new Error("Usuario no autorizado");
      }

      const solicitudUsuario = await this.prisma.solicitudUsuario.findMany({
        where: { solicitud_id: isToken.solicitud_id },
      });

      if (solicitudUsuario.length > 1) {
        throw new Error("Solicitud ya asignada a un empleado");
      }

      await this.prisma.solicitudUsuario.create({
        data: {
          solicitud_id: isToken.solicitud_id,
          usuario_id: empleadoSeleccionado.usuario_id,
        },
      });

      await this.changeRequestStatus(token, 2);

      return {
        statusCode: 200,
        message: "Solicitud asignada exitosamente al empleado de mesa de ayuda",
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: error.message || "Error al asignar la solicitud",
      };
    }
  }
}
