backend:
  name: git-gateway
  branch: main
media_folder: "assets/uploads"
public_folder: "/assets/uploads"
collections:
  - name: "website"
    label: "Website"
    files:
      - name: "store_content"
        label: "Store Content"
        file: "data/products.json"
        format: "json"
        fields:
          - label: "Website Information"
            name: "site"
            widget: "object"
            fields:
              - { label: "Brand Name", name: "brand", widget: "string" }
              - { label: "Tagline", name: "tagline", widget: "string" }
              - { label: "Introduction", name: "intro", widget: "text" }
              - { label: "Picfair Store Link", name: "picfairUrl", widget: "string" }
              - { label: "TeePublic Store Link", name: "teepublicUrl", widget: "string" }
              - { label: "Contact Email", name: "email", widget: "string", required: false }
          - label: "Products and Collections"
            name: "products"
            widget: "list"
            summary: "{{fields.title}} — {{fields.store}}"
            fields:
              - { label: "Title", name: "title", widget: "string" }
              - { label: "Category", name: "category", widget: "string", hint: "Examples: Photography, Birds, Apparel, Florida, Inspirational" }
              - { label: "Description", name: "description", widget: "text" }
              - { label: "Product Image", name: "image", widget: "image" }
              - { label: "Buy Link", name: "buyUrl", widget: "string" }
              - label: "Store"
                name: "store"
                widget: "select"
                options: ["Picfair", "TeePublic"]
              - { label: "Featured", name: "featured", widget: "boolean", default: false }
