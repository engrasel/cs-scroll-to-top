-- CreateTable
CREATE TABLE "ScrollToTopSettings" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "iconType" TEXT NOT NULL DEFAULT 'arrow',
    "buttonShape" TEXT NOT NULL DEFAULT 'circle',
    "buttonSize" INTEGER NOT NULL DEFAULT 50,
    "iconSize" INTEGER NOT NULL DEFAULT 20,
    "borderRadius" INTEGER NOT NULL DEFAULT 50,
    "borderWidth" INTEGER NOT NULL DEFAULT 0,
    "opacity" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "buttonColor" TEXT NOT NULL DEFAULT '#000000',
    "iconColor" TEXT NOT NULL DEFAULT '#ffffff',
    "hoverBackgroundColor" TEXT NOT NULL DEFAULT '#333333',
    "hoverIconColor" TEXT NOT NULL DEFAULT '#ffffff',
    "borderColor" TEXT NOT NULL DEFAULT '#000000',
    "shadowColor" TEXT NOT NULL DEFAULT '#000000',
    "buttonPosition" TEXT NOT NULL DEFAULT 'bottom-right',
    "bottomOffset" INTEGER NOT NULL DEFAULT 20,
    "sideOffset" INTEGER NOT NULL DEFAULT 20,
    "showOnDesktop" BOOLEAN NOT NULL DEFAULT true,
    "showOnMobile" BOOLEAN NOT NULL DEFAULT true,
    "hideAtTop" BOOLEAN NOT NULL DEFAULT false,
    "scrollThreshold" INTEGER NOT NULL DEFAULT 300,
    "scrollSpeed" TEXT NOT NULL DEFAULT 'medium',
    "animationType" TEXT NOT NULL DEFAULT 'fade',
    "enableShadow" BOOLEAN NOT NULL DEFAULT false,
    "shadowBlur" INTEGER NOT NULL DEFAULT 10,
    "shadowOpacity" DOUBLE PRECISION NOT NULL DEFAULT 0.3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScrollToTopSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrollToTopSettings_shop_key" ON "ScrollToTopSettings"("shop");
