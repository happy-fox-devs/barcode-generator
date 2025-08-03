import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FileText } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type {
  PageOptions,
  HorizontalAlignment,
  VerticalAlignment,
  Language,
} from "@/types/barcode";
import { cn } from "@/lib/utils";

interface PageSettingsProps {
  pageOptions: PageOptions;
  setPageOptions: (options: PageOptions) => void;
  language: Language;
}

export function PageSettings({
  pageOptions,
  setPageOptions,
  language,
}: PageSettingsProps) {
  const { t } = useTranslation(language);

  const handleChange = (field: keyof PageOptions, value: any) => {
    setPageOptions({
      ...pageOptions,
      [field]: value,
    });
  };

  return (
    <Card className="gap-0 border-none bg-transparent px-4 py-2 shadow-none">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-base dark:text-neutral-100">
          <FileText className="h-4 w-4" />
          {t("pageConfiguration")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-0">
        <div className="space-y-2">
          <Label className="text-sm dark:text-neutral-100">
            {t("pageUnit")}
          </Label>
          <Select
            value={pageOptions.pageUnit}
            onValueChange={(value) => handleChange("pageUnit", value)}
          >
            <SelectTrigger className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200">
              <SelectItem
                className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                value="in"
              >
                {t("inches")}
              </SelectItem>
              <SelectItem
                className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                value="cm"
              >
                {t("centimeters")}
              </SelectItem>
              <SelectItem
                className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                value="px"
              >
                {t("pixels")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm dark:text-neutral-100">
            {t("orientation")}
          </Label>
          <Select
            value={pageOptions.orientation}
            onValueChange={(value: "portrait" | "landscape") =>
              handleChange("orientation", value)
            }
          >
            <SelectTrigger className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200">
              <SelectItem
                className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                value="portrait"
              >
                {t("portrait")}
              </SelectItem>
              <SelectItem
                className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                value="landscape"
              >
                {t("landscape")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label
              htmlFor="page-width"
              className="text-xs dark:text-neutral-100"
            >
              {t("width")}
            </Label>
            <Input
              id="page-width"
              type="number"
              value={pageOptions.pageWidth}
              onChange={(e) =>
                handleChange(
                  "pageWidth",
                  Number.parseFloat(e.target.value) || 0,
                )
              }
              step="0.1"
              className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
            />
          </div>
          <div className="space-y-1">
            <Label
              htmlFor="page-height"
              className="text-xs dark:text-neutral-100"
            >
              {t("height")}
            </Label>
            <div className="flex gap-1">
              <Input
                id="page-height"
                type="number"
                value={pageOptions.pageHeight}
                onChange={(e) =>
                  handleChange(
                    "pageHeight",
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                step="0.1"
                disabled={pageOptions.autoHeight}
                className="h-8 flex-1 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
              />
              <Button
                variant={pageOptions.autoHeight ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  handleChange("autoHeight", !pageOptions.autoHeight)
                }
                className={cn(
                  "h-8 px-2 text-xs dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black",
                  {
                    "dark:opacity-70": pageOptions.autoHeight,
                  },
                )}
              >
                {t("auto")}
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm dark:text-neutral-100">
            {t("margins")}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label
                htmlFor="margin-top"
                className="text-xs dark:text-neutral-100"
              >
                {t("top")}
              </Label>
              <Input
                id="margin-top"
                type="number"
                value={pageOptions.marginTop}
                onChange={(e) =>
                  handleChange(
                    "marginTop",
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                step="0.1"
                className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="margin-bottom"
                className="text-xs dark:text-neutral-100"
              >
                {t("bottom")}
              </Label>
              <Input
                id="margin-bottom"
                type="number"
                value={pageOptions.marginBottom}
                onChange={(e) =>
                  handleChange(
                    "marginBottom",
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                step="0.1"
                className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="margin-left"
                className="text-xs dark:text-neutral-100"
              >
                {t("left")}
              </Label>
              <Input
                id="margin-left"
                type="number"
                value={pageOptions.marginLeft}
                onChange={(e) =>
                  handleChange(
                    "marginLeft",
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                step="0.1"
                className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="margin-right"
                className="text-xs dark:text-neutral-100"
              >
                {t("right")}
              </Label>
              <Input
                id="margin-right"
                type="number"
                value={pageOptions.marginRight}
                onChange={(e) =>
                  handleChange(
                    "marginRight",
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                step="0.1"
                className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm dark:text-neutral-100">
            {t("codeSpacing")}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label
                htmlFor="gap-horizontal"
                className="text-xs dark:text-neutral-100"
              >
                {t("horizontal")}
              </Label>
              <Input
                id="gap-horizontal"
                type="number"
                value={pageOptions.gapHorizontal}
                onChange={(e) =>
                  handleChange(
                    "gapHorizontal",
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                step="0.1"
                className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="gap-vertical"
                className="text-xs dark:text-neutral-100"
              >
                {t("vertical")}
              </Label>
              <Input
                id="gap-vertical"
                type="number"
                value={pageOptions.gapVertical}
                onChange={(e) =>
                  handleChange(
                    "gapVertical",
                    Number.parseFloat(e.target.value) || 0,
                  )
                }
                step="0.1"
                className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <Label className="text-sm dark:text-neutral-100">
            {t("alignment")}
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label
                htmlFor="horizontal-alignment"
                className="text-xs dark:text-neutral-100"
              >
                {t("horizontal")}
              </Label>
              <Select
                value={pageOptions.horizontalAlignment}
                onValueChange={(value: HorizontalAlignment) =>
                  handleChange("horizontalAlignment", value)
                }
              >
                <SelectTrigger
                  className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
                  id="horizontal-alignment"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200">
                  <SelectItem
                    className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                    value="left"
                  >
                    {t("left")}
                  </SelectItem>
                  <SelectItem
                    className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                    value="center"
                  >
                    {t("center")}
                  </SelectItem>
                  <SelectItem
                    className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                    value="right"
                  >
                    {t("right")}
                  </SelectItem>
                  <SelectItem
                    className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                    value="justify"
                  >
                    {t("justify")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="vertical-alignment"
                className="text-xs dark:text-neutral-100"
              >
                {t("vertical")}
              </Label>
              <Select
                value={pageOptions.verticalAlignment}
                onValueChange={(value: VerticalAlignment) =>
                  handleChange("verticalAlignment", value)
                }
              >
                <SelectTrigger
                  className="h-8 dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black"
                  id="vertical-alignment"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200">
                  <SelectItem
                    className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                    value="top"
                  >
                    {t("top")}
                  </SelectItem>
                  <SelectItem
                    className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                    value="center"
                  >
                    {t("center")}
                  </SelectItem>
                  <SelectItem
                    className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
                    value="bottom"
                  >
                    {t("bottom")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Label
            htmlFor="distribute-vertically"
            className="text-sm dark:text-neutral-100"
          >
            {t("distributeVertically")}
          </Label>
          <Switch
            id="distribute-vertically"
            className="dark:data-[state=checked]:bg-black"
            checked={pageOptions.distributeVertically}
            onCheckedChange={(checked) =>
              handleChange("distributeVertically", checked)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
