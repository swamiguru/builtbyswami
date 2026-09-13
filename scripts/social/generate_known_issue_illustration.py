#!/usr/bin/env python3
"""Generate a Known Issue story illustration via the same Gemini pipeline
used for Daily Five card illustrations (see generate_illustration() and
_tighten_illustration() in make_card.py -- this just reuses them).

Known Issue has no daily automation (it's hand-written, on request, no
quota -- see the Long Press project instructions), so this is a manual
CLI, not something a scheduled task calls.

Usage:
  python3 generate_known_issue_illustration.py <title> <description> <out.png>
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from make_card import generate_illustration  # noqa: E402


def main():
    if len(sys.argv) != 4:
        print("Usage: generate_known_issue_illustration.py <title> <description> <out.png>", file=sys.stderr)
        sys.exit(1)
    title, description, out = sys.argv[1:4]
    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    ok = generate_illustration("Known Issue", title, description, out)
    if not ok:
        print("FAILED to generate illustration -- check GEMINI_API_KEY / network", file=sys.stderr)
        sys.exit(2)
    print("OK:", out)


if __name__ == "__main__":
    main()
