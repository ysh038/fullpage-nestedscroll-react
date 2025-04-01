import React, { JSX } from "react";
interface FullPageWrapperProps {
    children: React.ReactNode;
    onScrollDirectionChange?: (direction: "up" | "down") => void;
}
export declare function FullPageWrapper({ children, onScrollDirectionChange }: FullPageWrapperProps): JSX.Element;
export {};
