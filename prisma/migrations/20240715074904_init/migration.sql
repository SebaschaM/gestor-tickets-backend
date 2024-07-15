-- CreateTable
CREATE TABLE `Empleado` (
    `empleado_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(191) NULL,
    `apellidos` VARCHAR(191) NULL,
    `usuario_id` INTEGER NOT NULL,

    PRIMARY KEY (`empleado_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Solicitante` (
    `solicitante_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombres` VARCHAR(191) NULL,
    `apellidos` VARCHAR(191) NULL,
    `usuario_id` INTEGER NULL,
    `tipo_oficina_id` INTEGER NULL,

    PRIMARY KEY (`solicitante_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoOficina` (
    `tipo_oficina_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_oficina` VARCHAR(191) NULL,

    PRIMARY KEY (`tipo_oficina_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Solicitud` (
    `solicitud_id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_ticket` VARCHAR(191) NULL,
    `asunto_solicitud` VARCHAR(191) NULL,
    `detalle_solicitud` VARCHAR(191) NULL,
    `fecha_asignada` DATETIME(3) NULL,
    `usuario_id` INTEGER NOT NULL,
    `tipo_solicitud_id` INTEGER NULL,
    `tipo_servicio_id` INTEGER NULL,
    `tipo_estado_id` INTEGER NULL,
    `tipo_prioridad_id` INTEGER NULL,
    `fecha_creacion` DATETIME(3) NULL,
    `fecha_modificacion` DATETIME(3) NULL,
    `token` VARCHAR(191) NULL,

    UNIQUE INDEX `Solicitud_token_key`(`token`),
    PRIMARY KEY (`solicitud_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoEstado` (
    `tipo_estado_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo_estado` VARCHAR(191) NULL,

    PRIMARY KEY (`tipo_estado_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPrioridad` (
    `tipo_prioridad_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo_prioridad` VARCHAR(191) NULL,

    PRIMARY KEY (`tipo_prioridad_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoServicio` (
    `tipo_servicio_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo_servicio` VARCHAR(191) NULL,
    `tipo_familia_id` INTEGER NOT NULL,

    PRIMARY KEY (`tipo_servicio_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoFamilia` (
    `tipo_familia_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo_familia` VARCHAR(191) NULL,

    PRIMARY KEY (`tipo_familia_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolicitudUsuario` (
    `solicitud_usuario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `solicitud_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,

    PRIMARY KEY (`solicitud_usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPerfilTecnico` (
    `tipo_perfil_tecnico_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo_perfil_tecnico` VARCHAR(191) NULL,

    PRIMARY KEY (`tipo_perfil_tecnico_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoPerfilTecnicoFamilia` (
    `tipo_perfil_tecnico_familia_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipo_perfil_tecnico_id` INTEGER NOT NULL,
    `tipo_familia_id` INTEGER NOT NULL,

    PRIMARY KEY (`tipo_perfil_tecnico_familia_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TipoSolicitud` (
    `tipo_solicitud_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo_solicitud` VARCHAR(191) NULL,

    PRIMARY KEY (`tipo_solicitud_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuario` (
    `usuario_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` VARCHAR(191) NULL,
    `correo` VARCHAR(191) NULL,
    `contrasenia` VARCHAR(191) NULL,
    `rol_id` INTEGER NOT NULL,

    PRIMARY KEY (`usuario_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rol` (
    `rol_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(191) NULL,

    PRIMARY KEY (`rol_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolTipoPerfilTecnico` (
    `rol_tipo_perfil_tecnico_id` INTEGER NOT NULL AUTO_INCREMENT,
    `rol_id` INTEGER NOT NULL,
    `tipo_perfil_tecnico_id` INTEGER NOT NULL,

    PRIMARY KEY (`rol_tipo_perfil_tecnico_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Empleado` ADD CONSTRAINT `Empleado_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solicitante` ADD CONSTRAINT `Solicitante_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`usuario_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solicitante` ADD CONSTRAINT `Solicitante_tipo_oficina_id_fkey` FOREIGN KEY (`tipo_oficina_id`) REFERENCES `TipoOficina`(`tipo_oficina_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solicitud` ADD CONSTRAINT `Solicitud_tipo_solicitud_id_fkey` FOREIGN KEY (`tipo_solicitud_id`) REFERENCES `TipoSolicitud`(`tipo_solicitud_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solicitud` ADD CONSTRAINT `Solicitud_tipo_servicio_id_fkey` FOREIGN KEY (`tipo_servicio_id`) REFERENCES `TipoServicio`(`tipo_servicio_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solicitud` ADD CONSTRAINT `Solicitud_tipo_estado_id_fkey` FOREIGN KEY (`tipo_estado_id`) REFERENCES `TipoEstado`(`tipo_estado_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Solicitud` ADD CONSTRAINT `Solicitud_tipo_prioridad_id_fkey` FOREIGN KEY (`tipo_prioridad_id`) REFERENCES `TipoPrioridad`(`tipo_prioridad_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoServicio` ADD CONSTRAINT `TipoServicio_tipo_familia_id_fkey` FOREIGN KEY (`tipo_familia_id`) REFERENCES `TipoFamilia`(`tipo_familia_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudUsuario` ADD CONSTRAINT `SolicitudUsuario_solicitud_id_fkey` FOREIGN KEY (`solicitud_id`) REFERENCES `Solicitud`(`solicitud_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudUsuario` ADD CONSTRAINT `SolicitudUsuario_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `Usuario`(`usuario_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoPerfilTecnicoFamilia` ADD CONSTRAINT `TipoPerfilTecnicoFamilia_tipo_perfil_tecnico_id_fkey` FOREIGN KEY (`tipo_perfil_tecnico_id`) REFERENCES `TipoPerfilTecnico`(`tipo_perfil_tecnico_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TipoPerfilTecnicoFamilia` ADD CONSTRAINT `TipoPerfilTecnicoFamilia_tipo_familia_id_fkey` FOREIGN KEY (`tipo_familia_id`) REFERENCES `TipoFamilia`(`tipo_familia_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Usuario` ADD CONSTRAINT `Usuario_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `Rol`(`rol_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolTipoPerfilTecnico` ADD CONSTRAINT `RolTipoPerfilTecnico_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `Rol`(`rol_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolTipoPerfilTecnico` ADD CONSTRAINT `RolTipoPerfilTecnico_tipo_perfil_tecnico_id_fkey` FOREIGN KEY (`tipo_perfil_tecnico_id`) REFERENCES `TipoPerfilTecnico`(`tipo_perfil_tecnico_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
