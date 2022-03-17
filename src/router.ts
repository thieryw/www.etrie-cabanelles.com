import {createRouter, defineRoute} from "type-route";
import {makeThisModuleAnExecutableRouteLister} from "github-pages-plugin-for-type-route";


export const routeDefs = {
	"home": defineRoute("/"),
	"eco-venue": defineRoute("/eco-lieu"),
	"presentation": defineRoute("/presentation"),
	"services": defineRoute("/services"),
	"hosting": defineRoute("/hebergement"),
	"gallery": defineRoute("/galerie"),
	"contact": defineRoute("/contact"),
	"legal": defineRoute("/mentions-legal")
};

makeThisModuleAnExecutableRouteLister(routeDefs);

export const {RouteProvider, routes, useRoute} = createRouter(
	routeDefs
);