"use client";

import { Button } from "@/components/ui/button";


interface AnalyseButtonProps {
    onClick?: () => void;
}

const AnalyseButton = ({ onClick }: AnalyseButtonProps) => {
    
    
    return (
        <Button onClick={onClick}>
            Analyse
        </Button>
    );
};

export default AnalyseButton;
