import { library } from '@fortawesome/fontawesome-svg-core';
import { faCog, faThumbsUp, faThumbsDown, faComments, faCodeBranch, faAngleRight, faCheck, faTimes, faUserLock, faClock, faCalendar } from '@fortawesome/free-solid-svg-icons';

import colors from './colors';
import variables from './variables';

library.add(faCog, faThumbsUp, faThumbsDown, faComments, faCodeBranch, faAngleRight, faCheck, faTimes, faUserLock, faClock, faCalendar);

const theme = {
  colors,
  variables
};

export default theme;
