import { format } from 'date-fns'

const datify = date => format(date, 'M/D/YY');

export default datify;