from flask import Flask, request, jsonify
import numpy as np


app = Flask(__name__)


@app.route("/distances", methods=["POST"])
def calculate_distance():
    """Calculates the distance between two matrices based on the specified distance metric.
    
    This function processes a JSON request containing two matrices and a distance type,
    then computes either the L1 (Manhattan) or L2 (Euclidean) distance between them.
    
    Returns:
        flask.Response: A JSON response containing either:
            - {"distance": float}: The calculated distance between the matrices.
            - {"error": str}: An error message if the matrices have different shapes
              or if an invalid distance type is specified.
    
    Raises:
        None: Errors are returned as JSON responses rather than raised.
    
    Note:
        - L1 distance: Sum of absolute differences between corresponding elements.
        - L2 distance: Square root of sum of squared differences (Euclidean distance).
        - Both matrices must have the same shape for calculation.
    """
    data = request.get_json()
    dist_type = data.get("distance")
    if dist_type == "L1":
        a = data.get("df1")
        b = data.get("df2")
        if np.asarray(a).shape != np.asarray(b).shape:
            return jsonify({"error": "Matrices must have the same shape"})
        dist = np.sum(np.abs(a - b))
        return jsonify({"distance": dist})
    elif dist_type == "L2":
        a = data.get("df1")
        b = data.get("df2")
        if np.asarray(a).shape != np.asarray(b).shape:
            return jsonify({"error": "Matrices must have the same shape"})
        dist = 0
        for i in range(len(a)):
            for j in range(len(a[i])):
                dist += (a[i][j] - b[i][j]) ** 2
        dist = np.sqrt(dist)
        return jsonify({"distance": dist})
    else:
        return jsonify({"error": "Invalid distance type"})