export declare const researchAgent: {
    model: string;
    description: string;
    prompt: string;
    tools: {
        bash: boolean;
        read: boolean;
        glob: boolean;
        grep: boolean;
        webfetch: boolean;
        websearch: boolean;
    };
    permission: {
        bash: string;
        read: string;
    };
};
