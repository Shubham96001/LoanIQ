import os
import unittest
from importlib import reload

from backend.config import settings as settings_module


class SettingsDefaultsTest(unittest.TestCase):
    def test_database_defaults_to_sqlite_when_not_configured(self):
        os.environ.pop("DATABASE_URL", None)
        reloaded = reload(settings_module)
        self.assertTrue(reloaded.DATABASE_URL.startswith("sqlite+aiosqlite:///"))
        self.assertIn("loaniq.sqlite3", reloaded.DATABASE_URL)


if __name__ == "__main__":
    unittest.main()
