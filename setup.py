"""Setup for eoldialogs XBlock."""

from __future__ import absolute_import

import os

from setuptools import setup


def package_data(pkg, roots):
    """Generic function to find package_data.

    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.

    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='eoldialogs-xblock',
    version='0.1',
    description='eoldialogs XBlock',   # TODO: write a better description.
    license='UNKNOWN',          # TODO: choose a license: 'AGPL v3' and 'Apache 2.0' are popular.
    packages=[
        'eoldialogs',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'eoldialogs = eoldialogs:EolDialogsXBlock',
        ]
    },
    package_data=package_data("eoldialogs", ["static", "public"]),
)