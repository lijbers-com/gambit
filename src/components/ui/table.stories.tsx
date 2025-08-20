import type { Meta, StoryObj } from '@storybook/react';
import { Table, TableColumn } from './table';
import { Badge } from './badge';
import { BadgeCheck } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  parameters: {
    docs: {
      page: null,
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

type Row = {
  id: number;
  alerts: string;
  status: string;
  player: string;
  mac: string;
  hostname: string;
  storeLogo: string;
  store: string;
  attributes: number;
};

const columns: TableColumn<Row>[] = [
  { key: 'id', header: 'ID' },
  { key: 'alerts', header: 'Alerts' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => (
      <Badge variant="default" className="inline-flex items-center gap-1 text-xs font-medium bg-green-50 text-green-700 border border-green-100">
        <BadgeCheck className="h-4 w-4 mr-1 text-green-500" />
        {row.status}
      </Badge>
    ),
    className: 'w-32',
  },
  {
    key: 'player',
    header: 'Player',
    render: (row) => (
      <div>
        <div className="font-medium text-slate-800">{row.player}</div>
        <div className="text-xs text-slate-500">MAC Address: {row.mac}</div>
        <div className="text-xs text-slate-400">Hostname: {row.hostname}</div>
      </div>
    ),
    className: 'w-64',
  },
  {
    key: 'store',
    header: 'Store',
    render: (row) => (
      <div className="flex items-center gap-2">
        <img src={row.storeLogo} alt="store" className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200" />
        <span>{row.store}</span>
      </div>
    ),
    className: 'w-72',
  },
  { key: 'attributes', header: 'Attributes' },
];

const data: Row[] = [
  {
    id: 8410,
    alerts: '0 alert(s)',
    status: 'Online',
    player: 'ZELFSCANPLEIN 4e – 1xPT, Q15a4-AH-WWM',
    mac: '00:01:80:90:83:cb',
    hostname: 'gambit-33',
    storeLogo: '/store-logo.png',
    store: '1534 - Burg Van Stamplein 270 HOOFDDORP',
    attributes: 0,
  },
  {
    id: 8192,
    alerts: '0 alert(s)',
    status: 'Online',
    player: 'ZELFSCANPLEIN 3e – 1xPT, Q15a3-AH-WWM',
    mac: '00:01:80:bc:b2:8f',
    hostname: 'gambit-28',
    storeLogo: '/store-logo.png',
    store: '1534 - Burg Van Stamplein 270 HOOFDDORP',
    attributes: 0,
  },
  {
    id: 8740,
    alerts: '0 alert(s)',
    status: 'Online',
    player: 'ZELFSCANPLEIN 3e – 1xPT, Q15a3-AH-WWM',
    mac: '00:01:80:bb:63:30',
    hostname: 'gambit-26',
    storeLogo: '/store-logo.png',
    store: '1621 - Zwanenveld 5505 NIJMEGEN',
    attributes: 0,
  },
  // ...add more rows as needed
];

export const Default: Story = {
  render: () => (
    <div className="p-8 bg-slate-50 min-h-screen">
      <Table columns={columns} data={data} rowKey={(row) => row.id} />
    </div>
  ),
};

export const SelectableRows: Story = {
  render: () => {
    const [selected, setSelected] = React.useState<any[]>([]);
    const data = [
      { id: 1, name: 'Alice', email: 'alice@email.com' },
      { id: 2, name: 'Bob', email: 'bob@email.com' },
      { id: 3, name: 'Charlie', email: 'charlie@email.com' },
    ];
    return (
      <div className="p-6 bg-white">
        <Table
          columns={[
            { key: 'name', header: 'Name' },
            { key: 'email', header: 'Email' },
          ]}
          data={data}
          rowKey={row => row.id}
          rowSelection={{
            selectedKeys: selected,
            onChange: setSelected,
            getKey: row => row.id,
          }}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          Selected IDs: {selected.join(', ') || 'None'}
        </div>
      </div>
    );
  },
}; 