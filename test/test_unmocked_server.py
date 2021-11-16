import unittest
import sys
import os

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))

# Getting the parent directory name
# where the current directory is present.
parent = os.path.dirname(current)

# adding the parent directory to
# the sys.path.
sys.path.append(parent)

from delivery import (
    verify_grubhub_link,
    verify_uber_eats_link,
    verify_doordash_link,
    verify_postmates_link,
)


class DeliveryHelperTests(unittest.TestCase):
    def test_verify_grubhub_link_1(self):
        self.assertEqual(verify_grubhub_link("", ""), False)

    def test_verify_grubhub_link_2(self):
        self.assertEqual(
            verify_grubhub_link(
                "https://www.grubhub.com/restaurant/a-restaurant-wth-alls-the--characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            True,
        )

    def test_verify_grubhub_link_3(self):
        self.assertEqual(
            verify_grubhub_link(
                "https://www.grubhub.com/restaurant/a-restaurant-w*th-all's-#the-&-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            False,
        )

    def test_verify_uber_eats_link_1(self):
        self.assertEqual(verify_uber_eats_link("", ""), False)

    def test_verify_uber_eats_link_2(self):
        self.assertEqual(
            verify_uber_eats_link(
                "https://www.ubereats.com/store/a-restaurant-w*th-alls-%23the-%26-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            True,
        )

    def test_verify_uber_eats_link_3(self):
        self.assertEqual(
            verify_uber_eats_link(
                "https://www.ubereats.com/store/a-restaurant-w*th-all's-#the-&-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            False,
        )

    def test_verify_doordash_link_1(self):
        self.assertEqual(verify_doordash_link("", ""), False)

    def test_verify_doordash_link_2(self):
        self.assertEqual(
            verify_doordash_link(
                "https://www.doordash.com/store/a-restaurant-w*th-all's-#the-&-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            True,
        )

    def test_verify_doordash_link_3(self):
        self.assertEqual(
            verify_doordash_link(
                "https://www.doordash.com/store/a-restaurant-wth-alls-the--characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            False,
        )

    def test_verify_doordash_link_4(self):
        self.assertEqual(
            verify_doordash_link(
                "https://www.doordash.com/store/a-restaurant-w*th-all-s-#the-&-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            True,
        )

    def test_verify_doordash_link_5(self):
        self.assertEqual(
            verify_doordash_link(
                "https://www.doordash.com/store/a-restaurant-w*th-all%27s-#the-&-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            True,
        )

    def test_verify_postmates_link_1(self):
        self.assertEqual(verify_postmates_link("", ""), False)

    def test_verify_postmates_link_2(self):
        self.assertEqual(
            verify_postmates_link(
                "https://postmates.com/store/a-restaurant-w*th-alls-%23the-%26-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            True,
        )

    def test_verify_postmates_link_3(self):
        self.assertEqual(
            verify_postmates_link(
                "https://postmates.com/store/a-restaurant-w*th-all's-#the-&-characters",
                "A-Restaurant W*th All's #the & Characters",
            ),
            False,
        )


if __name__ == "__main__":
    unittest.main()
