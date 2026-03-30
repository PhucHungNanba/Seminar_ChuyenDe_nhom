# Chapter 13 – Unit Tests (practice)

This folder contains the practice code and tests described in Chapter 13.

## Prereqs

- Python 3.x available on PATH
- Run commands from inside the `ch13` folder

## 1) N-grams – unit tests + data-driven tests

Run all tests under `ngrams/`:

```powershell
cd ch13
python -m unittest discover -s ngrams -p "test*.py" -v
```

Run the chapter-level examples in the `ch13` root:

```powershell
cd ch13
python -m unittest test_data_driven_ngrams.py -v
python -m unittest test_ngrams_chatgpt.py -v
```

### Note on imports

The folder `ngrams/` is a Python package (has `__init__.py`). When you `cd ch13`, tests can simply import:

```python
from ngrams import create_ngrams
```

## 2) Rectangle intersection – TDD exercise

Each rectangle folder is self-contained: it has a `rectangle_intersection.py` implementation and a `test_rectangle_intersection.py` suite.

Run tests for the ChatGPT variant:

```powershell
cd ch13\rectangle_intersection_chatGPT
python -m unittest test_rectangle_intersection.py -v
```

Run tests for the GitHub Copilot variant:

```powershell
cd ch13\rectangle_intersection_GitHub_copilot
python -m unittest test_rectangle_intersection.py -v
```

## Suggested workflow (matches Chapter 13)

1. Run the tests (they should fail if the implementation is a stub).
2. Implement/fix the function to satisfy the failures.
3. Re-run the same tests until everything is green.
