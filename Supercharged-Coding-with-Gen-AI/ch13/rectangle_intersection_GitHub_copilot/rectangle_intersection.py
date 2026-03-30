# Performs assessment of the intersection area of two rectangles.


def rect_intersection_area(rect1, rect2):
    """Return the intersection area of two axis-aligned rectangles.

    Rectangles are tuples: (xll, yll, xur, yur)
      - (xll, yll): lower-left corner
      - (xur, yur): upper-right corner

    Raises:
        ValueError: if either rectangle has non-positive width or height.
    """

    x1, y1, x2, y2 = rect1
    a1, b1, a2, b2 = rect2

    if x1 >= x2 or y1 >= y2:
        raise ValueError(f"Invalid rectangle dimensions for rect1: {rect1}")
    if a1 >= a2 or b1 >= b2:
        raise ValueError(f"Invalid rectangle dimensions for rect2: {rect2}")

    x_left = max(x1, a1)
    y_bottom = max(y1, b1)
    x_right = min(x2, a2)
    y_top = min(y2, b2)

    if x_left < x_right and y_bottom < y_top:
        return (x_right - x_left) * (y_top - y_bottom)

    return 0