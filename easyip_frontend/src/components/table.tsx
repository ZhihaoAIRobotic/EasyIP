"use client";

import { Table } from "@douyinfe/semi-ui";

export default function ScriptTable() {
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
        <Table
            columns={columns}
            dataSource={data}
        />
    )
}