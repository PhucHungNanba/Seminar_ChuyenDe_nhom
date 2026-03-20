import numpy as np

def get_area(
        radius: float,
        ) -> float:
    area: float = np.pi * radius ** 2
    return area


def get_arithmetic_mean(
        x1: float, 
        x2: float,
        ) -> float:
    arithmetic_mean: float = (x1 + x2) / 2
    return arithmetic_mean


CONTEXT: You are provided with a Python function enclosed with {{{ FUNCTION }}} that calls functions that should be completed.
TASK: Implement the missing functions.

FUNCTION: {{{def get_average_return(net_returns: Dict[str, float]) -> float: \n\tgross_returns: np.ndarray = get_gross_returns(net_returns) \n\tgross_average: float = get_geometric_mean(gross_returns) \n\tnet_average: float = get_net_average(gross_average) \n\treturn net_average }}}
CODE:
