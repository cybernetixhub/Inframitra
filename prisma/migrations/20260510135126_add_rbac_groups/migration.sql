-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "RbacGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "permissions" TEXT[],
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RbacGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRbacGroup" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "UserRbacGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RbacGroup_name_key" ON "RbacGroup"("name");

-- CreateIndex
CREATE INDEX "UserRbacGroup_userId_idx" ON "UserRbacGroup"("userId");

-- CreateIndex
CREATE INDEX "UserRbacGroup_groupId_idx" ON "UserRbacGroup"("groupId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRbacGroup_userId_groupId_key" ON "UserRbacGroup"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "UserRbacGroup" ADD CONSTRAINT "UserRbacGroup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRbacGroup" ADD CONSTRAINT "UserRbacGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "RbacGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
