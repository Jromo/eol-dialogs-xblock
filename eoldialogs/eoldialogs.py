import pkg_resources

from django.template import Context, Template

from xblock.core import XBlock
from xblock.fields import Integer, Scope, String
from xblock.fragment import Fragment
from xblockutils.studio_editable import StudioEditableXBlockMixin

# Make '_' a no-op so we can scrape strings
_ = lambda text: text



class EolDialogsXBlock(StudioEditableXBlockMixin, XBlock):

    display_name = String(
        display_name=_("Display Name"),
        help=_("Display name for this module"),
        default="Eol Dialogs XBlock",
        scope=Scope.settings,
    )

    icon_class = String(
        default="other",
        scope=Scope.settings,
    )

    image_url = String(
        display_name=_("URL del personaje"),
        help=_("Indica la URL a la imagen del personaje en el dialogo"),
        default="https://static.sumaysigue.uchile.cl/cmmeduformacion/produccion/assets/img/diag_aldo.png",
        scope=Scope.settings,
    )

    background_color = String(
        display_name=_("Color de fondo"),
        help=_("Color del contenedor del dialogo"),
        default="#F8E37B",
        scope=Scope.settings,
    )

    text_color = String(
        display_name=_("Color del texto"),
        help=_("Color del texto del dialogo"),
        default="#000000",
        scope=Scope.settings,
    )

    side = String(
        display_name = _("Posicion"),
        help = _("Indica la posicion del dialogo"),
        default = "Izquierda",
        values = ["Izquierda", "Derecha"],
        scope = Scope.settings
    )

    content = String(
        display_name="Contenido del dialogo", 
        multiline_editor='html', 
        resettable_editor=False,
        default="<p>Contenido del dialogo.</p>", 
        scope=Scope.settings,
        help="Indica el contenido del dialogo"
    )

    editable_fields = ('image_url', 'background_color', 'text_color', 'side', 'content')

    def resource_string(self, path):
        """Handy helper for getting resources from our kit."""
        data = pkg_resources.resource_string(__name__, path)
        return data.decode("utf8")

    def student_view(self, context=None):
        context_html = self.get_context()
        template = self.render_template('static/html/eoldialogs.html', context_html)
        frag = Fragment(template)
        frag.add_css(self.resource_string("static/css/eoldialogs.css"))
        frag.add_javascript(self.resource_string("static/js/src/eoldialogs.js"))
        frag.initialize_js('EolDialogsXBlock')
        return frag

    def get_context(self):
        return {
            'xblock': self,
            'location': str(self.location).split('@')[-1]
        }

    def render_template(self, template_path, context):
        template_str = self.resource_string(template_path)
        template = Template(template_str)
        return template.render(Context(context))
    