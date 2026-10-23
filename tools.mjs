import {tasks,notes,countdown} from './productivity.mjs?v=20261023f';
import {colors,password,text,gallery} from './creative.mjs?v=20261023f';
import {quiz,github,movies,weather} from './explore.mjs?v=20261023f';
export function mountTool(id,root){return ({tasks,notes,countdown,colors,password,text,gallery,quiz,github,movies,weather})[id](root)}
