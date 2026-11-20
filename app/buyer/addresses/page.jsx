import { MapPin } from "lucide-react";
import PageHeader from "@/components/dashboard/PageHeader";
import DialogForm from "@/components/dashboard/DialogForm";
import ConfirmAction from "@/components/dashboard/ConfirmAction";
import { TextField, AreaField, CheckField } from "@/components/dashboard/ServerForm";
import Badge from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { requireRole } from "@/lib/auth";
import { listAddresses, MAX_ADDRESSES } from "@/lib/repositories/addresses";
import { saveAddressAction, setDefaultAddressAction, deleteAddressAction } from "@/lib/actions/addresses";

export const metadata = { title: "Alamat Saya" };

function AddressFields({ a }) {
  return (
    <>
      {a && <input type="hidden" name="id" value={a.id} />}
      <TextField name="label" label="Label" required maxLength={50} defaultValue={a?.label ?? ""} placeholder="Rumah, Kantor, …" />
      <TextField name="recipientName" label="Nama penerima" required maxLength={100} defaultValue={a?.recipient_name ?? ""} />
      <TextField name="phone" label="Nomor telepon" required defaultValue={a?.phone ?? ""} />
      <AreaField name="fullAddress" label="Alamat lengkap" required rows={3} maxLength={500} defaultValue={a?.full_address ?? ""} hint="Jalan, kelurahan, kota, kode pos." />
      <CheckField name="isDefault" label="Jadikan alamat utama" defaultChecked={a?.is_default ?? false} />
    </>
  );
}

export default async function BuyerAddressesPage() {
  const me = await requireRole(["buyer"]);
  const addresses = await listAddresses(me.id);
  const full = addresses.length >= MAX_ADDRESSES;

  return (
    <>
      <PageHeader
        title="Alamat saya"
        description={`Alamat tersimpan bisa dipilih saat checkout. Maksimal ${MAX_ADDRESSES} alamat.`}
        actions={
          full ? (
            <p className="text-sm text-muted-strong">Batas alamat tercapai</p>
          ) : (
            <DialogForm triggerLabel="Tambah alamat" title="Tambah alamat" action={saveAddressAction} submitLabel="Simpan alamat">
              <AddressFields />
            </DialogForm>
          )
        }
      />
      {addresses.length === 0 ? (
        <EmptyState icon={MapPin} title="Belum ada alamat tersimpan" description="Tambahkan alamat agar checkout lebih cepat. Alamat pertama otomatis menjadi alamat utama." />
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {addresses.map((a) => (
            <li key={a.id} className="flex flex-col rounded-card border border-line bg-surface p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-card-title">{a.label}</h2>
                {a.is_default && <Badge tone="brand">Utama</Badge>}
              </div>
              <p className="mt-2 text-sm font-medium">{a.recipient_name} · {a.phone}</p>
              <p className="mt-1 flex-1 whitespace-pre-line text-sm text-muted-strong">{a.full_address}</p>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <DialogForm triggerLabel="Ubah" triggerVariant="outline" triggerSize="sm" title={`Ubah alamat ${a.label}`} action={saveAddressAction}>
                  <AddressFields a={a} />
                </DialogForm>
                {!a.is_default && (
                  <ConfirmAction action={setDefaultAddressAction} fields={{ id: a.id }} label="Jadikan utama" ariaLabel={`Jadikan ${a.label} alamat utama`} />
                )}
                <ConfirmAction
                  action={deleteAddressAction} fields={{ id: a.id }} label="Hapus" ariaLabel={`Hapus alamat ${a.label}`}
                  confirmTitle={`Hapus alamat "${a.label}"?`}
                  confirmDescription="Pesanan yang sudah dibuat tidak terpengaruh karena alamatnya sudah tersalin di pesanan."
                  confirmLabel="Ya, hapus" destructive
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
