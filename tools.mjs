import {buildProjects,mountBuildProject} from './project-collection.mjs?v=20261024subtle';
import {tasks,notes,countdown} from './productivity.mjs?v=20261024subtle';
import {colors,password,text,gallery} from './creative.mjs?v=20261024subtle';
import {quiz,github,movies,weather} from './explore.mjs?v=20261024subtle';
export function mountTool(id,root){if(buildProjects.some(p=>p.id===id))return mountBuildProject(id,root);return ({tasks,notes,countdown,colors,password,text,gallery,quiz,github,movies,weather})[id](root)}
