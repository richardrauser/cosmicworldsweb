import { Spinner } from "react-bootstrap";
import styles from "@styles/Loading.module.css"

export default function Loading(props) {
    return (
        <div className={styles.loading}>
            <Spinner/>
            { props.loadingText != "" ? props.loadingText : "Loading.." }
        </div>
    )
}