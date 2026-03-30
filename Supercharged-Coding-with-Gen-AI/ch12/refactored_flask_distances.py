"""
This module provides a Flask application for calculating distances between two vectors.
It supports Manhattan (L1) and Euclidean (L2) distance metrics.
"""

import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/distances", methods=["POST"])
def calculate_distance():
    """
    Calculate the distance between two vectors based on the specified distance type.

    This function parses the request parameters, selects the appropriate distance
    calculation function, computes the distance, and returns it as a JSON response.

    Args:
        request: The Flask request object containing JSON data with 'df1', 'df2', and 'distance'.

    Returns:
        flask.Response: A JSON responswdwwwwwwwwwwwwwwe containing the calculated distance.
    """
    a, b, dist_type = parse_request_parameters(request)
    dist_func = {"L1": get_manhattan_dist, "L2": get_euclidean_dist}.get(dist_type)
    dist = dist_func(a, b)
    return jsonify({"distance": dist})

def parse_request_parameters(request):
    """
    Parse and validate the request parameters from the JSON data.

    Extracts the vectors 'df1' and 'df2' and the distance type from the request JSON,
    converts them to numpy arrays, and returns them.

    Args:
        request: The Flask request object containing the JSON data.

    Returns:
        tuple: A tuple containing:
            - a (np.ndarray): The first vector.
            - b (np.ndarray): The second vector.
            - dist_type (str): The distance type ('L1' or 'L2').
    """
    data = request.get_json()
    a = np.array(data.get("df1",))
    b = np.array(data.get("df2",))
    dist_type = data.get("distance")
    return a, b, dist_type

def get_manhattan_dist(a: np.ndarray, b: np.ndarray) -> float:
    """
    Calculate the Manhattan (L1) distance between two vectors.

    The Manhattan distance is the sum of the absolute differences of their coordinates.

    Args:
        a (np.ndarray): The first vector.
        b (np.ndarray): The second vector.

    Returns:
        float: The Manhattan distance between the two vectors.
    """
    return np.sum(np.abs(a - b))

def get_euclidean_dist(a: np.ndarray, b: np.ndarray) -> float:
    """
    Calculate the squared Euclidean (L2) distance between two vectors.

    Args:
        a (np.ndarray): The first vector.
        b (np.ndarray): The second vector.

    Returns:
        float: The squared Euclidean distance between the two vectors.
    """
    return np.sum((a - b) ** 2)
