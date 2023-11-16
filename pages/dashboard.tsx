import React from "react";
import { PageProps } from "objects";
import { useAppSelector } from "context";
import { Dashboard } from "paca-ui";

export default function DashboardPage({ header, fetchAPI }: PageProps) {
    const branches = useAppSelector((state) => state.branches).branches;
    const branchInfo = branches[useAppSelector((state) => state.branches).current];

    return (
        <Dashboard
            header={header}
            userName={header.name!}
            localFilled={42}
            reservations={24}
            reservationsToApprove={3}
            monthlyProfit={[
                {
                    date: "2021-01-01",
                    profit: 512.45,
                },
                {
                    date: "2021-01-02",
                    profit: 632.97,
                },
                {
                    date: "2021-01-03",
                    profit: 407.2,
                },
                {
                    date: "2021-01-04",
                    profit: 789.3,
                },
                {
                    date: "2021-01-05",
                    profit: 428.5,
                },
                {
                    date: "2021-01-06",
                    profit: 810.1,
                },
                {
                    date: "2021-01-07",
                    profit: 1024.3,
                },
                {
                    date: "2021-01-08",
                    profit: 612.45,
                },
                {
                    date: "2021-01-09",
                    profit: 632.97,
                },
            ]}
            bestProducts={[
                { name: "Pizza triple queso", quantity: 24 },
                { name: "Hamburguesa", quantity: 16 },
                { name: "Ensalada César", quantity: 13 },
            ]}
        />
    );
}
