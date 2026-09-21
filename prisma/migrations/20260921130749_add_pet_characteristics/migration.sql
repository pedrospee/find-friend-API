/*
  Warnings:

  - Added the required column `age` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `energy_level` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PetAge" AS ENUM ('FILHOTE', 'ADULTO', 'IDOSO');

-- CreateEnum
CREATE TYPE "PetSize" AS ENUM ('PEQUENO', 'MEDIO', 'GRANDE');

-- CreateEnum
CREATE TYPE "PetEnergyLevel" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "age" "PetAge" NOT NULL,
ADD COLUMN     "energy_level" "PetEnergyLevel" NOT NULL,
ADD COLUMN     "size" "PetSize" NOT NULL;
