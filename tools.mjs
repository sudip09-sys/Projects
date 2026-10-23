import {buildProjects,mountBuildProject} from './project-collection.mjs?v=20261023projects';
import {tasks,notes,countdown} from './productivity.mjs?v=20261023projects';
import {colors,password,text,gallery} from './creative.mjs?v=20261023projects';
import {quiz,github,movies,weather} from './explore.mjs?v=20261023projects';
export function mountTool(id,root){if(buildProjects.some(p=>p.id===id))return mountBuildProject(id,root);return ({tasks,notes,countdown,colors,password,text,gallery,quiz,github,movies,weather})[id](root)}
