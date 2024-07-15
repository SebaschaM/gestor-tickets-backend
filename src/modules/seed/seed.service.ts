import { Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    const roles = [
      { nombre_rol: "Solicitante" },
      { nombre_rol: "Mesa de Partes" },
      { nombre_rol: "Interno Soporte Técnico" },
      { nombre_rol: "Interno Infraestructura" },
      { nombre_rol: "Interno Desarrollo y base de datos" },
    ];

    for (const rol of roles) {
      await this.prisma.rol.create({
        data: rol,
      });
    }
    this.logger.log("Roles creados.");

    const perfilesTecnicos = [
      { nombre_tipo_perfil_tecnico: "Ninguno" },
      { nombre_tipo_perfil_tecnico: "Soporte Técnico" },
      { nombre_tipo_perfil_tecnico: "Infraestructura" },
      { nombre_tipo_perfil_tecnico: "Desarrollo y base de datos" },
    ];

    for (const perfil of perfilesTecnicos) {
      await this.prisma.tipoPerfilTecnico.create({
        data: perfil,
      });
    }
    this.logger.log("Perfiles técnicos creados.");

    const estados = [
      { nombre_tipo_estado: "Abierto" },
      { nombre_tipo_estado: "Asignado" },
      { nombre_tipo_estado: "Atendido" },
      { nombre_tipo_estado: "Cerrado" },
    ];

    for (const estado of estados) {
      await this.prisma.tipoEstado.create({
        data: estado,
      });
    }
    this.logger.log("Estados creados.");

    const prioridades = [
      { nombre_tipo_prioridad: "Alta" },
      { nombre_tipo_prioridad: "Media" },
      { nombre_tipo_prioridad: "Baja" },
    ];

    for (const prioridad of prioridades) {
      await this.prisma.tipoPrioridad.create({
        data: prioridad,
      });
    }
    this.logger.log("Prioridades creadas.");

    const familias = [
      { nombre_tipo_familia: "Equipos Informáticos" },
      { nombre_tipo_familia: "Herramientas de Colaboración" },
      { nombre_tipo_familia: "Herramientas de Telefonía" },
      { nombre_tipo_familia: "Sistemas de Información" },
    ];

    for (const familia of familias) {
      await this.prisma.tipoFamilia.create({
        data: familia,
      });
    }
    this.logger.log("Familias creadas.");

    const solicitudes = [
      { nombre_tipo_solicitud: "Requerimiento" },
      { nombre_tipo_solicitud: "Incidencia" },
    ];

    for (const solicitud of solicitudes) {
      await this.prisma.tipoSolicitud.create({
        data: solicitud,
      });
    }
    this.logger.log("Tipos de solicitud creados.");

    const solicitanteRole = await this.prisma.rol.findFirst({
      where: { nombre_rol: "Solicitante" },
    });

    const mesaDePartesRole = await this.prisma.rol.findFirst({
      where: { nombre_rol: "Mesa de Partes" },
    });

    const soporteTecnicoRole = await this.prisma.rol.findFirst({
      where: { nombre_rol: "Interno Soporte Técnico" },
    });

    const infraestructuraRole = await this.prisma.rol.findFirst({
      where: { nombre_rol: "Interno Infraestructura" },
    });

    const desarrolloBaseDatosRole = await this.prisma.rol.findFirst({
      where: { nombre_rol: "Interno Desarrollo y base de datos" },
    });

    await this.prisma.usuario.create({
      data: {
        nombre_usuario: process.env.NOMBRE_USUARIO_SOLICITANTE,
        correo: process.env.CORREO_SOLICITANTE,
        contrasenia: await bcrypt.hash(process.env.PASSWORD_GENERAL, 10),
        rol_id: solicitanteRole?.rol_id!,
      },
    });

    await this.prisma.usuario.create({
      data: {
        nombre_usuario: process.env.NOMBRE_USUARIO_MESA_DE_PARTES,
        correo: process.env.CORREO_MESA_DE_PARTES,
        contrasenia: await bcrypt.hash(process.env.PASSWORD_GENERAL, 10),
        rol_id: mesaDePartesRole?.rol_id!,
      },
    });

    await this.prisma.usuario.create({
      data: {
        nombre_usuario: process.env.NOMBRE_USUARIO_INTERNO_TECNICO,
        correo: process.env.CORREO_USUARIO_INTERNO_TECNICO,
        contrasenia: await bcrypt.hash(process.env.PASSWORD_GENERAL, 10),
        rol_id: soporteTecnicoRole?.rol_id!,
      },
    });

    await this.prisma.usuario.create({
      data: {
        nombre_usuario: process.env.NOMBRE_USUARIO_INTERNO_INFRAESTRUCTURA,
        correo: process.env.CORREO_USUARIO_INTERNO_INFRAESTRUCTURA,
        contrasenia: await bcrypt.hash(process.env.PASSWORD_GENERAL, 10),
        rol_id: infraestructuraRole?.rol_id!,
      },
    });

    await this.prisma.usuario.create({
      data: {
        nombre_usuario: process.env.NOMBRE_USUARIO_INTERNO_DESARROLLODB,
        correo: process.env.CORREO_USUARIO_INTERNO_DESARROLLODB,
        contrasenia: await bcrypt.hash(process.env.PASSWORD_GENERAL, 10),
        rol_id: desarrolloBaseDatosRole?.rol_id!,
      },
    });

    this.logger.log("Usuarios creados.");

    const equiposInformaticos = await this.prisma.tipoFamilia.findFirst({
      where: { nombre_tipo_familia: "Equipos Informáticos" },
    });

    const herramientasColaboracion = await this.prisma.tipoFamilia.findFirst({
      where: { nombre_tipo_familia: "Herramientas de Colaboración" },
    });

    const herramientasTelefonia = await this.prisma.tipoFamilia.findFirst({
      where: { nombre_tipo_familia: "Herramientas de Telefonía" },
    });

    const sistemasInformacion = await this.prisma.tipoFamilia.findFirst({
      where: { nombre_tipo_familia: "Sistemas de Información" },
    });

    const soporteTecnico = await this.prisma.tipoPerfilTecnico.findFirst({
      where: { nombre_tipo_perfil_tecnico: "Soporte Técnico" },
    });

    const infraestructura = await this.prisma.tipoPerfilTecnico.findFirst({
      where: { nombre_tipo_perfil_tecnico: "Infraestructura" },
    });

    const desarrolloBaseDatos = await this.prisma.tipoPerfilTecnico.findFirst({
      where: { nombre_tipo_perfil_tecnico: "Desarrollo y base de datos" },
    });

    const tiposServicio = [
      {
        nombre: "Asistencia y soporte técnico",
        familiaId: equiposInformaticos?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Garantías",
        familiaId: equiposInformaticos?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Habilitación",
        familiaId: equiposInformaticos?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Mantenimiento",
        familiaId: equiposInformaticos?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Revisiones técnicas",
        familiaId: equiposInformaticos?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Video conferencias",
        familiaId: equiposInformaticos?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Almacenamiento en la nube institucional",
        familiaId: herramientasColaboracion?.tipo_familia_id!,
        perfilId: infraestructura?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Calendario",
        familiaId: herramientasColaboracion?.tipo_familia_id!,
        perfilId: infraestructura?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Carpeta Compartida",
        familiaId: herramientasColaboracion?.tipo_familia_id!,
        perfilId: infraestructura?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Correo Electrónico",
        familiaId: herramientasColaboracion?.tipo_familia_id!,
        perfilId: infraestructura?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Internet",
        familiaId: herramientasColaboracion?.tipo_familia_id!,
        perfilId: infraestructura?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Mensajería Instantánea",
        familiaId: herramientasColaboracion?.tipo_familia_id!,
        perfilId: infraestructura?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Usuarios de dominio",
        familiaId: herramientasColaboracion?.tipo_familia_id!,
        perfilId: infraestructura?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Telefonía IP",
        familiaId: herramientasTelefonia?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Telefonía Móvil",
        familiaId: herramientasTelefonia?.tipo_familia_id!,
        perfilId: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
      {
        nombre: "Aplicaciones",
        familiaId: sistemasInformacion?.tipo_familia_id!,
        perfilId: desarrolloBaseDatos?.tipo_perfil_tecnico_id!,
      },
    ];

    for (const tipo of tiposServicio) {
      await this.prisma.tipoServicio.create({
        data: {
          nombre_tipo_servicio: tipo.nombre,
          tipo_familia_id: tipo.familiaId,
        },
      });
    }
    this.logger.log("Tipos de servicio creados.");

    const perfilTecnicoFamilia = [
      {
        tipo_perfil_tecnico_id: soporteTecnico?.tipo_perfil_tecnico_id!,
        tipo_familia_id: equiposInformaticos?.tipo_familia_id!,
      },
      {
        tipo_perfil_tecnico_id: soporteTecnico?.tipo_perfil_tecnico_id!,
        tipo_familia_id: herramientasTelefonia?.tipo_familia_id!,
      },
      {
        tipo_perfil_tecnico_id: infraestructura?.tipo_perfil_tecnico_id!,
        tipo_familia_id: herramientasColaboracion?.tipo_familia_id!,
      },
      {
        tipo_perfil_tecnico_id: desarrolloBaseDatos?.tipo_perfil_tecnico_id!,
        tipo_familia_id: sistemasInformacion?.tipo_familia_id!,
      },
    ];

    for (const ptf of perfilTecnicoFamilia) {
      await this.prisma.tipoPerfilTecnicoFamilia.create({
        data: ptf,
      });
    }
    this.logger.log("Relaciones en TipoPerfilTecnicoFamilia creadas.");

    await this.prisma.solicitante.create({
      data: {
        nombres: "Sthefanny",
        apellidos: "Jimenez Ccahuana",
        usuario_id: 1,
      },
    });

    this.logger.log("Solicitante creado.");

    await this.prisma.empleado.create({
      data: {
        nombres: "María",
        apellidos: "López Ramírez",
        usuario_id: 2,
      },
    });

    await this.prisma.empleado.create({
      data: {
        nombres: "Juan",
        apellidos: "Rodríguez Pérez",
        usuario_id: 3,
      },
    });

    await this.prisma.empleado.create({
      data: {
        nombres: "Ana",
        apellidos: "Martínez Gómez",
        usuario_id: 4,
      },
    });

    await this.prisma.empleado.create({
      data: {
        nombres: "Luis",
        apellidos: "Torres Fernández",
        usuario_id: 5,
      },
    });

    this.logger.log("Empleado creado.");

    await this.prisma.rolTipoPerfilTecnico.create({
      data: {
        rol_id: soporteTecnicoRole?.rol_id!,
        tipo_perfil_tecnico_id: soporteTecnico?.tipo_perfil_tecnico_id!,
      },
    });

    await this.prisma.rolTipoPerfilTecnico.create({
      data: {
        rol_id: infraestructuraRole?.rol_id!,
        tipo_perfil_tecnico_id: infraestructura?.tipo_perfil_tecnico_id!,
      },
    });

    await this.prisma.rolTipoPerfilTecnico.create({
      data: {
        rol_id: desarrolloBaseDatosRole?.rol_id!,
        tipo_perfil_tecnico_id: desarrolloBaseDatos?.tipo_perfil_tecnico_id!,
      },
    });

    this.logger.log("Relaciones en RolTipoPerfilTecnico creadas.");

    this.logger.log("Seed finalizado.");
  }

  async findTypesRequest() {
    try {
      const typesRequest = await this.prisma.tipoSolicitud.findMany();
      return typesRequest;
    } catch (error) {
      this.logger.error("Error al buscar los tipos de solicitud", error);
      return {
        message: "Error al buscar los tipos de solicitud",
        statusCode: 500,
      };
    }
  }

  async findTypesFamily() {
    try {
      const typesFamily = await this.prisma.tipoFamilia.findMany();
      return typesFamily;
    } catch (error) {
      this.logger.error("Error al buscar los tipos de familia", error);
      return {
        message: "Error al buscar los tipos de familia",
        statusCode: 500,
      };
    }
  }

  async findTypesService(idFamily: string) {
    try {
      const typesService = await this.prisma.tipoServicio.findMany({
        where: {
          tipo_familia_id: parseInt(idFamily),
        },
      });
      return typesService;
    } catch (error) {
      this.logger.error("Error al buscar los tipos de servicio", error);
      return {
        message: "Error al buscar los tipos de servicio",
        statusCode: 500,
      };
    }
  }
}
