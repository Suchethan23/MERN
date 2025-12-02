// components/FileUploader.jsx
export default function FileUploader({ onSelect }) {
  return (
    <input
      type="file"
      accept=".csv,.xlsx,.xls"
      onChange={(e) => onSelect(e.target.files[0])}
    />
  );
}
