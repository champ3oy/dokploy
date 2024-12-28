import { ShowMonitoring } from "@/components/dashboard/monitoring/web-server/show";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { IS_CLOUD, validateRequest } from "@dokploy/server";
import type { GetServerSidePropsContext } from "next";
import React, { type ReactElement } from "react";

const Dashboard = () => {
	const [data, setData] = React.useState(null);
	const ws = new WebSocket("ws://localhost:3000/listen-monitoring");

	React.useEffect(() => {
		ws.onopen = () => {
			console.log("WebSocket conectado");
		};
		ws.onmessage = (event) => {
			console.log(event.data);
			setData(JSON.parse(event.data));
		};

		ws.onerror = (e) => {
			console.log("WebSocket error", e);
		};
	});

	return <div>{JSON.stringify(data)}</div>;
	// return <ShowMonitoring />;
};

export default Dashboard;

Dashboard.getLayout = (page: ReactElement) => {
	return <DashboardLayout tab={"monitoring"}>{page}</DashboardLayout>;
};
export async function getServerSideProps(
	ctx: GetServerSidePropsContext<{ serviceId: string }>,
) {
	if (IS_CLOUD) {
		return {
			redirect: {
				permanent: true,
				destination: "/dashboard/projects",
			},
		};
	}
	const { user } = await validateRequest(ctx.req, ctx.res);
	if (!user) {
		return {
			redirect: {
				permanent: true,
				destination: "/",
			},
		};
	}

	return {
		props: {},
	};
}
