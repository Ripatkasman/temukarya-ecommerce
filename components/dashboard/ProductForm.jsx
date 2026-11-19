import { ServerForm, TextField, AreaField, SelectField, CheckField, ImageField, SubmitBtn } from "./ServerForm";
import Button from "@/components/ui/Button";
import { saveProductAction } from "@/lib/actions/seller";

/** Form tambah/ubah produk seller. `product` kosong = produk baru (gambar wajib). */
export default function ProductForm({ product, categories }) {
  const editing = Boolean(product);
  return (
    <ServerForm action={saveProductAction} className="max-w-2xl">
      {editing && <input type="hidden" name="id" value={product.id} />}
      <TextField name="name" label="Nama produk" required maxLength={150} defaultValue={product?.name ?? ""} />
      <AreaField name="description" label="Deskripsi" required rows={5} maxLength={5000} defaultValue={product?.description ?? ""} hint="Ceritakan bahan, ukuran, dan keunikan produk." />
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField name="price" label="Harga (Rp)" required type="number" inputMode="numeric" min={1} defaultValue={product?.price ?? ""} />
        <TextField name="stock" label="Stok" required type="number" inputMode="numeric" min={0} defaultValue={product?.stock ?? ""} />
      </div>
      <SelectField
        name="categoryId" label="Kategori" required placeholder="Pilih kategori"
        defaultValue={product?.category_id ?? ""}
        options={categories.map((c) => ({ value: c.id, label: c.name }))}
      />
      <ImageField
        label="Gambar produk" required={!editing} currentUrl={product?.image_url}
        hint={editing ? "Pilih file baru hanya jika ingin mengganti gambar. JPG, PNG, atau WebP, maksimal 2 MB." : "JPG, PNG, atau WebP, maksimal 2 MB."}
      />
      <CheckField name="isActive" label="Tampilkan di katalog" hint="Produk nonaktif tidak muncul di halaman publik." defaultChecked={product ? product.is_active : true} />
      <div className="flex flex-wrap gap-3 pt-2">
        <SubmitBtn size="lg" loadingLabel="Menyimpan…">{editing ? "Simpan perubahan" : "Tambah produk"}</SubmitBtn>
        <Button href="/seller/products" variant="outline" size="lg">Batal</Button>
      </div>
    </ServerForm>
  );
}
