"use client";

import React from 'react';
import { Table } from "@douyinfe/semi-ui";

function ScriptTable() {
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
        },
    ];

    const data = [
        { name: 'John', age: 28 },
        { name: 'Jane', age: 32 },
    ];

    return (
        <div style={{ border: '1px solid #e9e9e9', borderRadius: '8px', padding: '16px', height: '90vh' }}>
            <Table
                pagination={false}
                columns={columns}
                dataSource={data}
            />
        </div>
    );
}

export default ScriptTable;