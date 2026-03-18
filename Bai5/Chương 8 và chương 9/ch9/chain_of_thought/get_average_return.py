from typing import Dict

import numpy as np


def get_average_return(
        net_returns: Dict[str, float],
) -> float:
    gross_returns: np.ndarray = get_gross_returns(net_returns)
    gross_average: float = get_geometric_mean(gross_returns)
    net_average: float = get_net_average(gross_average)
    return net_average


def get_gross_returns





        net_returns: Dict[str, float],
) -> np.ndarray:
    gross_returns: np.ndarray = np.array(list(net_returns.values())) + 1
    return gross_returns


def get_geometric_mean(
        gross_returns: np.ndarray,
) -> float:
    gross_average: float = np.prod(gross_returns) ** (1 / len(gross_returns))
    return gross_average


def get_net_average(
        gross_average: float,
) -> float:
    net_average: float = gross_average - 1
    return net_average



    import numpy as np
from typing import Dict, List, Union

def get_gross_returns(net_returns: Union[Dict[str, float], List[float]]) -> np.ndarray:
    """Calculates gross returns from net returns.

    Args:
        net_returns: A dictionary with asset names as keys and net returns as
            values, or a list of net returns.

    Returns:
        A numpy array containing the calculated gross returns.
    """
    return np.array(list(net_returns.values()) if isinstance(net_returns, dict) else net_returns) + 1.0

def get_arithmetic_mean(gross_returns: np.ndarray) -> float:
    """Calculates the arithmetic mean of gross returns.

    Args:
        gross_returns: A numpy array of gross returns.

    Returns:
        The arithmetic mean of the gross returns.
    """
    return float(np.mean(gross_returns))

def get_geometric_mean(gross_returns: np.ndarray) -> float:
    """Calculates the geometric mean of gross returns.

    Args:
        gross_returns: A numpy array of gross returns.

    Returns:
        The geometric mean of the gross returns.
    """
    return float(np.prod(gross_returns)**(1.0/len(gross_returns)))