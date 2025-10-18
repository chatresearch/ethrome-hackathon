import React from 'react';
interface QueryBuilderProps {
    onSubmit: (imageBase64: string, agent?: string) => Promise<void>;
    isLoading?: boolean;
    availableAgents?: {
        name: string;
        description: string;
    }[];
}
export declare const QueryBuilder: React.FC<QueryBuilderProps>;
export {};
//# sourceMappingURL=QueryBuilder.d.ts.map