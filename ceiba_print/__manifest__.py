{
    'name': 'Ceiba Local Print',
    'version': '1.0',
    'category': 'Extra Tools',
    'summary': 'Trigger browser native print dialogue for PDF reports instead of downloading.',
    'description': """
        This module overrides the default Odoo report action for PDF reports.
        When a user clicks 'Print', it will trigger the browser's native print dialogue
        directly instead of prompting to download the PDF file.
    """,
    'author': 'Antigravity',
    'depends': ['web'],
    'data': [],
    'assets': {
        'web.assets_backend': [
            'ceiba_print/static/src/js/report_print_handler.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
    'license': 'LGPL-3',
}
