interface IGoOrderSteps {
    partNumber: string | number
    x_aos_stk: string
}

const goOrderSteps = async ({ partNumber, x_aos_stk }: IGoOrderSteps) => {}

export default goOrderSteps
