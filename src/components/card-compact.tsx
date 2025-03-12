import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";

type CardCompactProps = {
    title: string;
    description: string;
    className?: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
}

const CardCompact = ({ title, description, className, content, footer }: CardCompactProps) => {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {content}
            </CardContent>
            {footer && (<CardFooter className="flex justify-bottom">{footer}</CardFooter>)}
        </Card>
    );
};

export { CardCompact };