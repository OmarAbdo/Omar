import { ReactNode } from "react";
import type { TFunction, i18n } from "i18next";

export type LayoutProps = {
  children: ReactNode;
};

export type TranslatableComponentProps = {
  t: TFunction<"translation", undefined>;
  i18n: i18n;
};
