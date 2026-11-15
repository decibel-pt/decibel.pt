#!/usr/bin/env python3
"""Check that inline translations include Spanish and English (Portuguese is the HTML)."""

from html.parser import HTMLParser
from pathlib import Path
import re
import sys

LANGUAGES = ("es", "en")
TRANSLATION = re.compile(r"data-(es|en)(-.*)?$")


class TranslationChecker(HTMLParser):
    def __init__(self):
        super().__init__()
        self.errors = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        suffixes = {
            match[2] or "" for name in attrs if (match := TRANSLATION.fullmatch(name))
        }
        for suffix in sorted(suffixes):
            for language in LANGUAGES:
                name = f"data-{language}{suffix}"
                if not (attrs.get(name) or "").strip():
                    line, _ = self.getpos()
                    self.errors.append(f"index.html:{line}: <{tag}> missing {name}")


if __name__ == "__main__":
    checker = TranslationChecker()
    checker.feed((Path(__file__).resolve().parents[1] / "index.html").read_text())
    checker.close()
    if checker.errors:
        print("\n".join(checker.errors), file=sys.stderr)
        sys.exit(1)
    print(
        "All inline translations have Spanish and English values; Portuguese uses the original HTML."
    )
