// resources/js/pages/Backend/CMS/SharedData/Edit.jsx
import SharedDataForm from './Form';
export default function Edit({ shared_data, available_types }) {
  return <SharedDataForm shared_data={shared_data} available_types={available_types} />;
}