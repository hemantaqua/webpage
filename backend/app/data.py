from .models import Category, Product

# Placeholder data
CATEGORIES = [
    Category(id=1, name="Irrigation Systems", slug="irrigation-systems", description="State-of-the-art irrigation solutions for modern agriculture."),
    Category(id=2, name="Water Distribution", slug="water-distribution", description="Reliable and efficient water distribution pipes and fittings."),
    Category(id=3, name="Solar Solutions", slug="solar-solutions", description="High-quality PV Junction Boxes and other solar components."),
]

PRODUCTS = [
    Product(id=1, name="Drip Irrigation Kit", slug="drip-irrigation-kit", description="A complete kit for efficient drip irrigation in a 1-acre farm. Saves water and increases yield.", images=["https://placehold.co/600x400/22c55e/ffffff?text=Drip+Kit", "https://placehold.co/600x400/16a34a/ffffff?text=Pipes"], category_slug="irrigation-systems"),
    Product(id=2, name="Sprinkler System", slug="sprinkler-system", description="Automated sprinkler system for large fields and lawns. Even water distribution guaranteed.", images=["https://placehold.co/600x400/22c55e/ffffff?text=Sprinkler"], category_slug="irrigation-systems"),
    Product(id=3, name="HDPE Pipes", slug="hdpe-pipes", description="High-Density Polyethylene pipes, durable and resistant to chemicals. Available in various sizes.", images=["https://placehold.co/600x400/3b82f6/ffffff?text=HDPE+Pipes"], category_slug="water-distribution"),
    Product(id=4, name="PVC Fittings", slug="pvc-fittings", description="A wide range of PVC fittings including elbows, tees, and couplers.", images=["https://placehold.co/600x400/3b82f6/ffffff?text=Fittings"], category_slug="water-distribution"),
    Product(id=5, name="PV Junction Box", slug="pv-junction-box", description="IP68 rated Photovoltaic Junction Box for solar panels. Ensures safety and performance.", images=["https://placehold.co/600x400/f59e0b/ffffff?text=Junction+Box"], category_slug="solar-solutions"),
]