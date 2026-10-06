"use client";

import { useEffect, useState } from "react";
import "./sales-page.css";

type Settings = {
  hero_eyebrow: string;
  hero_title: string;
  hero_description: string;
  hero_cta_text: string;
  hero_cta_url: string;

  early_bird_price: number;
  early_bird_status: string;
  current_price: number;
  current_regular_price: number;
  next_batch_price: number;

  countdown_enabled: number;
  countdown_minutes: number;

  urgency_title: string;
  urgency_description: string;

  value_title: string;
  value_description: string;

  bonus_title: string;
  bonus_description: string;

  final_title: string;
  final_description: string;
  final_cta_text: string;
  final_cta_url: string;

  background_type: "color" | "image" | "video";
  background_media_url: string;
  background_color: string;
  background_overlay_color: string;
  background_overlay_opacity: number;

  accent_color: string;
  danger_color: string;

  container_max_width: number;
  container_radius: number;
  container_opacity: number;
  container_border_opacity: number;

  page_surface_color: string;
  is_published: number;
};

type Item = {
  id?: number;
  sectionType: "value" | "bonus";
  title: string;
  description: string;
  valueAmount: number | null;
  sortOrder: number;
  isActive: boolean;
};

function money(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

export default function SalesPageAdmin() {
  const [settings, setSettings] =
    useState<Settings | null>(null);

  const [items, setItems] =
    useState<Item[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  async function load() {
    try {
      const response = await fetch(
        "/api/admin/sales-page",
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil data."
        );
      }

      const data =
        await response.json();

      setSettings(data.settings);
      setItems(data.items || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function setting(
    key: keyof Settings,
    value:
      | string
      | number
      | boolean
  ) {
    setSettings(
      (current) =>
        current
          ? {
              ...current,
              [key]: value,
            }
          : current
    );
  }

  function itemUpdate(
    target: Item,
    key: keyof Item,
    value:
      | string
      | number
      | boolean
      | null
  ) {
    setItems((current) =>
      current.map((item) =>
        item === target
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    );
  }

  function addItem(
    sectionType: "value" | "bonus"
  ) {
    setItems((current) => [
      ...current,
      {
        sectionType,
        title: "",
        description: "",
        valueAmount: null,
        sortOrder:
          current.filter(
            (x) =>
              x.sectionType ===
              sectionType
          ).length + 1,
        isActive: true,
      },
    ]);
  }

  function removeItem(
    target: Item
  ) {
    setItems((current) =>
      current.filter(
        (item) => item !== target
      )
    );
  }

  async function save() {
    if (!settings) return;

    setSaving(true);
    setSaved(false);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/sales-page",
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            settings,
            items,
          }),
        }
      );

      if (!response.ok) {
        const data =
          await response
            .json()
            .catch(() => null);

        throw new Error(
          data?.error ||
            "Gagal menyimpan."
        );
      }

      setSaved(true);

      window.setTimeout(
        () => setSaved(false),
        2500
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="sales-admin">
        <div className="sales-admin-loading">
          Loading Sales Page...
        </div>
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="sales-admin">
        <div className="sales-admin-error">
          {error ||
            "Sales page belum tersedia."}
        </div>
      </main>
    );
  }

  const values =
    items.filter(
      (item) =>
        item.sectionType === "value"
    );

  const bonuses =
    items.filter(
      (item) =>
        item.sectionType === "bonus"
    );

  return (
    <main className="sales-admin">
      <div className="sales-admin-header">
        <div>
          <div className="sales-admin-eyebrow">
            RIZMAGO LAB STUDIO / SALES CMS
          </div>

          <h1>Sales Page</h1>

          <p>
            Atur tampilan, offer, urgency,
            benefit, bonus dan checkout dari
            satu tempat.
          </p>
        </div>

        <div className="sales-admin-actions">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="sales-preview"
          >
            Preview
          </a>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="sales-save"
          >
            {saving
              ? "Menyimpan..."
              : "Simpan"}
          </button>
        </div>
      </div>

      {saved && (
        <div className="sales-success">
          ✓ Sales page berhasil disimpan.
        </div>
      )}

      {error && (
        <div className="sales-error">
          {error}
        </div>
      )}

      {/* VISUAL */}
      <section className="sales-panel visual-panel">
        <div className="panel-heading">
          <span>00</span>
          <div>
            <h2>Visual & Container</h2>
            <p>
              Kamu bisa mengganti mood sales
              page tanpa menyentuh CSS.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            <span>Background Type</span>

            <select
              value={
                settings.background_type
              }
              onChange={(e) =>
                setting(
                  "background_type",
                  e.target.value
                )
              }
            >
              <option value="color">
                Solid Color
              </option>

              <option value="image">
                Image
              </option>

              <option value="video">
                Video
              </option>
            </select>
          </label>

          <label>
            <span>Background Media URL</span>

            <input
              placeholder={
                settings.background_type ===
                "video"
                  ? "https://.../background.mp4"
                  : "https://.../background.jpg"
              }
              value={
                settings.background_media_url
              }
              onChange={(e) =>
                setting(
                  "background_media_url",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            <span>Background Color</span>

            <div className="color-field">
              <input
                type="color"
                value={
                  settings.background_color
                }
                onChange={(e) =>
                  setting(
                    "background_color",
                    e.target.value
                  )
                }
              />

              <input
                value={
                  settings.background_color
                }
                onChange={(e) =>
                  setting(
                    "background_color",
                    e.target.value
                  )
                }
              />
            </div>
          </label>

          <label>
            <span>Container Surface</span>

            <div className="color-field">
              <input
                type="color"
                value={
                  settings.page_surface_color
                }
                onChange={(e) =>
                  setting(
                    "page_surface_color",
                    e.target.value
                  )
                }
              />

              <input
                value={
                  settings.page_surface_color
                }
                onChange={(e) =>
                  setting(
                    "page_surface_color",
                    e.target.value
                  )
                }
              />
            </div>
          </label>

          <label>
            <span>Accent Color</span>

            <div className="color-field">
              <input
                type="color"
                value={
                  settings.accent_color
                }
                onChange={(e) =>
                  setting(
                    "accent_color",
                    e.target.value
                  )
                }
              />

              <input
                value={
                  settings.accent_color
                }
                onChange={(e) =>
                  setting(
                    "accent_color",
                    e.target.value
                  )
                }
              />
            </div>
          </label>

          <label>
            <span>Urgency / Red Accent</span>

            <div className="color-field">
              <input
                type="color"
                value={
                  settings.danger_color
                }
                onChange={(e) =>
                  setting(
                    "danger_color",
                    e.target.value
                  )
                }
              />

              <input
                value={
                  settings.danger_color
                }
                onChange={(e) =>
                  setting(
                    "danger_color",
                    e.target.value
                  )
                }
              />
            </div>
          </label>

          <label>
            <span>Overlay Color</span>

            <div className="color-field">
              <input
                type="color"
                value={
                  settings.background_overlay_color
                }
                onChange={(e) =>
                  setting(
                    "background_overlay_color",
                    e.target.value
                  )
                }
              />

              <input
                value={
                  settings.background_overlay_color
                }
                onChange={(e) =>
                  setting(
                    "background_overlay_color",
                    e.target.value
                  )
                }
              />
            </div>
          </label>

          <label>
            <span>Overlay Opacity</span>

            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={
                settings.background_overlay_opacity
              }
              onChange={(e) =>
                setting(
                  "background_overlay_opacity",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Container Max Width</span>

            <input
              type="number"
              min="900"
              max="1600"
              value={
                settings.container_max_width
              }
              onChange={(e) =>
                setting(
                  "container_max_width",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Container Radius</span>

            <input
              type="number"
              min="0"
              max="50"
              value={
                settings.container_radius
              }
              onChange={(e) =>
                setting(
                  "container_radius",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Container Opacity</span>

            <input
              type="number"
              min="0.2"
              max="1"
              step="0.05"
              value={
                settings.container_opacity
              }
              onChange={(e) =>
                setting(
                  "container_opacity",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Border Opacity</span>

            <input
              type="number"
              min="0"
              max="1"
              step="0.05"
              value={
                settings.container_border_opacity
              }
              onChange={(e) =>
                setting(
                  "container_border_opacity",
                  Number(e.target.value)
                )
              }
            />
          </label>
        </div>

        <div className="visual-tip">
          <b>Video background:</b>{" "}
          gunakan direct URL file video
          seperti <code>.mp4</code> atau
          <code>.webm</code>.
        </div>
      </section>

      {/* HERO */}
      <section className="sales-panel">
        <div className="panel-heading">
          <span>01</span>
          <div>
            <h2>Hero</h2>
            <p>
              Headline, positioning dan CTA
              utama.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            <span>Eyebrow</span>
            <input
              value={
                settings.hero_eyebrow
              }
              onChange={(e) =>
                setting(
                  "hero_eyebrow",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            <span>CTA Text</span>
            <input
              value={
                settings.hero_cta_text
              }
              onChange={(e) =>
                setting(
                  "hero_cta_text",
                  e.target.value
                )
              }
            />
          </label>

          <label className="full">
            <span>Headline</span>
            <textarea
              rows={3}
              value={
                settings.hero_title
              }
              onChange={(e) =>
                setting(
                  "hero_title",
                  e.target.value
                )
              }
            />
          </label>

          <label className="full">
            <span>Description</span>
            <textarea
              rows={4}
              value={
                settings.hero_description
              }
              onChange={(e) =>
                setting(
                  "hero_description",
                  e.target.value
                )
              }
            />
          </label>

          <label className="full">
            <span>CTA URL</span>
            <input
              value={
                settings.hero_cta_url
              }
              onChange={(e) =>
                setting(
                  "hero_cta_url",
                  e.target.value
                )
              }
            />
          </label>
        </div>
      </section>

      {/* OFFER */}
      <section className="sales-panel sales-panel-offer">
        <div className="panel-heading">
          <span>02</span>
          <div>
            <h2>Offer & Urgency</h2>
            <p>
              Price ladder dan countdown.
            </p>
          </div>
        </div>

        <div className="price-preview">
          <div>
            <small>EARLY BIRD</small>
            <strong>
              {money(
                settings.early_bird_price
              )}
            </strong>
            <b>
              {settings.early_bird_status}
            </b>
          </div>

          <i>→</i>

          <div>
            <small>CURRENT</small>
            <del>
              {money(
                settings.current_regular_price
              )}
            </del>
            <strong>
              {money(
                settings.current_price
              )}
            </strong>
          </div>

          <i>→</i>

          <div>
            <small>NEXT BATCH</small>
            <strong>
              {money(
                settings.next_batch_price
              )}
            </strong>
          </div>
        </div>

        <div className="form-grid">
          <label>
            <span>Early Bird</span>
            <input
              type="number"
              value={
                settings.early_bird_price
              }
              onChange={(e) =>
                setting(
                  "early_bird_price",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Early Bird Status</span>
            <input
              value={
                settings.early_bird_status
              }
              onChange={(e) =>
                setting(
                  "early_bird_status",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            <span>Current Price</span>
            <input
              type="number"
              value={
                settings.current_price
              }
              onChange={(e) =>
                setting(
                  "current_price",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Coret / Anchor Price</span>
            <input
              type="number"
              value={
                settings.current_regular_price
              }
              onChange={(e) =>
                setting(
                  "current_regular_price",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Next Batch</span>
            <input
              type="number"
              value={
                settings.next_batch_price
              }
              onChange={(e) =>
                setting(
                  "next_batch_price",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label>
            <span>Countdown Minutes</span>
            <input
              type="number"
              min="1"
              value={
                settings.countdown_minutes
              }
              onChange={(e) =>
                setting(
                  "countdown_minutes",
                  Number(e.target.value)
                )
              }
            />
          </label>

          <label className="full">
            <span>Urgency Title</span>
            <input
              value={
                settings.urgency_title
              }
              onChange={(e) =>
                setting(
                  "urgency_title",
                  e.target.value
                )
              }
            />
          </label>

          <label className="full">
            <span>Urgency Description</span>
            <textarea
              rows={3}
              value={
                settings.urgency_description
              }
              onChange={(e) =>
                setting(
                  "urgency_description",
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <label className="toggle-row">
          <input
            type="checkbox"
            checked={Boolean(
              settings.countdown_enabled
            )}
            onChange={(e) =>
              setting(
                "countdown_enabled",
                e.target.checked
              )
            }
          />

          <span>
            Aktifkan countdown
          </span>
        </label>
      </section>

      {/* VALUE */}
      <section className="sales-panel">
        <div className="panel-heading">
          <span>03</span>
          <div>
            <h2>Benefit</h2>
            <p>
              Semua value stack yang
              ditampilkan ke visitor.
            </p>
          </div>
        </div>

        <div className="section-copy">
          <label>
            <span>Title</span>
            <input
              value={
                settings.value_title
              }
              onChange={(e) =>
                setting(
                  "value_title",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              rows={3}
              value={
                settings.value_description
              }
              onChange={(e) =>
                setting(
                  "value_description",
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <div className="item-list">
          {values.map((item) => (
            <div
              className="item-editor"
              key={
                item.id ??
                `${item.sectionType}-${item.sortOrder}`
              }
            >
              <div className="item-number">
                {item.sortOrder}
              </div>

              <div className="item-fields">
                <input
                  placeholder="Nama benefit"
                  value={item.title}
                  onChange={(e) =>
                    itemUpdate(
                      item,
                      "title",
                      e.target.value
                    )
                  }
                />

                <textarea
                  rows={2}
                  placeholder="Deskripsi"
                  value={
                    item.description
                  }
                  onChange={(e) =>
                    itemUpdate(
                      item,
                      "description",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Estimated value"
                  value={
                    item.valueAmount ?? ""
                  }
                  onChange={(e) =>
                    itemUpdate(
                      item,
                      "valueAmount",
                      e.target.value
                        ? Number(
                            e.target.value
                          )
                        : null
                    )
                  }
                />
              </div>

              <button
                type="button"
                className="item-remove"
                onClick={() =>
                  removeItem(item)
                }
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="add-item"
          onClick={() =>
            addItem("value")
          }
        >
          + Tambah Benefit
        </button>
      </section>

      {/* BONUS */}
      <section className="sales-panel">
        <div className="panel-heading">
          <span>04</span>
          <div>
            <h2>Bonus</h2>
            <p>
              Bonus dan estimated value.
            </p>
          </div>
        </div>

        <div className="section-copy">
          <label>
            <span>Title</span>
            <input
              value={
                settings.bonus_title
              }
              onChange={(e) =>
                setting(
                  "bonus_title",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            <span>Description</span>
            <textarea
              rows={3}
              value={
                settings.bonus_description
              }
              onChange={(e) =>
                setting(
                  "bonus_description",
                  e.target.value
                )
              }
            />
          </label>
        </div>

        <div className="item-list">
          {bonuses.map((item) => (
            <div
              className="item-editor"
              key={
                item.id ??
                `${item.sectionType}-${item.sortOrder}`
              }
            >
              <div className="item-number">
                {item.sortOrder}
              </div>

              <div className="item-fields">
                <input
                  placeholder="Nama bonus"
                  value={item.title}
                  onChange={(e) =>
                    itemUpdate(
                      item,
                      "title",
                      e.target.value
                    )
                  }
                />

                <textarea
                  rows={2}
                  placeholder="Deskripsi"
                  value={
                    item.description
                  }
                  onChange={(e) =>
                    itemUpdate(
                      item,
                      "description",
                      e.target.value
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Estimated value"
                  value={
                    item.valueAmount ?? ""
                  }
                  onChange={(e) =>
                    itemUpdate(
                      item,
                      "valueAmount",
                      e.target.value
                        ? Number(
                            e.target.value
                          )
                        : null
                    )
                  }
                />
              </div>

              <button
                type="button"
                className="item-remove"
                onClick={() =>
                  removeItem(item)
                }
              >
                Hapus
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          className="add-item"
          onClick={() =>
            addItem("bonus")
          }
        >
          + Tambah Bonus
        </button>
      </section>

      {/* FINAL */}
      <section className="sales-panel">
        <div className="panel-heading">
          <span>05</span>
          <div>
            <h2>Final CTA</h2>
            <p>
              Penutup sales page.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label className="full">
            <span>Title</span>
            <input
              value={
                settings.final_title
              }
              onChange={(e) =>
                setting(
                  "final_title",
                  e.target.value
                )
              }
            />
          </label>

          <label className="full">
            <span>Description</span>
            <textarea
              rows={3}
              value={
                settings.final_description
              }
              onChange={(e) =>
                setting(
                  "final_description",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            <span>CTA Text</span>
            <input
              value={
                settings.final_cta_text
              }
              onChange={(e) =>
                setting(
                  "final_cta_text",
                  e.target.value
                )
              }
            />
          </label>

          <label>
            <span>CTA URL</span>
            <input
              value={
                settings.final_cta_url
              }
              onChange={(e) =>
                setting(
                  "final_cta_url",
                  e.target.value
                )
              }
            />
          </label>
        </div>
      </section>

      <div className="sales-bottom-save">
        <button
          type="button"
          className="sales-save large"
          onClick={save}
          disabled={saving}
        >
          {saving
            ? "Menyimpan..."
            : "Simpan Sales Page"}
        </button>
      </div>
    </main>
  );
}