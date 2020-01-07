import { full } from '../../core/styles/full'
import { background } from '../../core/styles/background'
import { ColorMode } from '@thi.ng/color'

export const editor = () => {
    return [
        'div',
        {
            style: {
                ...full,
                ...background('#000000', ColorMode.CSS)
            }
        }
    ]
}
