import EntryDropdown from "../Entry/EntryDropdown/EntryDropdown";
import { EntryText } from "../Entry/EntryText/EntryText";
import { Button } from "react-bootstrap";
import { Icon } from "../Icon/Icon";
import { useNavigate } from "react-router-dom";
import { LoggedInUser, Meme } from "../../types/types";
import { useEffect, useState } from "react";

import "./filterSection.scss";


interface FilterSection {
    setQueryString: (query: string) => void;
    queryString: string;
    className?: 'feed-filter' | 'editor-filter' | '';
}


interface queryOptions {
    sort?: string
    limit?: number
    name?: string
    url?: string
    id?: string
    fileformat?: string
}

export const FilterSection = ({ setQueryString, queryString, className }: FilterSection) => {

    const sortFilters = [
        { value: 'desc', display: 'Newest' },
        { value: 'asc', display: 'Oldest' },
    ]

    const limitFilters = [
        { value: 5, display: '5' },
        { value: 10, display: '10' },
        { value: 20, display: '20' },
    ]

    const fileFormatFilters = [
        { value: 'png', display: 'PNG' },
        { value: 'jpg', display: 'JPG' },
        { value: 'jpeg', display: 'JPEG' },
        { value: 'gif', display: 'GIF' },
    ]


    const [sortSelected, setSortSelected] = useState<string>('Newest')
    const [limitSelected, setLimitSelected] = useState<string>('10')
    const [fileFormatSelected, setFileFormatSelected] = useState<string>('PNG')
    const [nameFilter, setNameFilter] = useState<string>('')
    const [filterReset, setFilterReset] = useState<boolean>(false)
    const [query, setQuery] = useState<queryOptions>({
        sort: 'desc',
        limit: 10,
    })


    useEffect(() => {
        formatQuery()
        // dont use name filter here so we can make less calls to the backend
    }, [sortSelected, limitSelected, fileFormatSelected])

    const formatQuery = () => {
        let array = []
        let params
        for (const p in query)
            if (query.hasOwnProperty(p)) {
                // @ts-ignore
                array.push(
                    encodeURIComponent(p) +
                    '=' +
                    // @ts-ignore
                    encodeURIComponent(query[p as keyof queryOptions])
                )
            }
        params = `?${array.join('&')}`
        setQueryString(params)
    }

    const handleFilterDropdownChange = (
        optionName: string,
        optionValue: string,
        queryValue: string
    ) => {
        setSortSelected(optionValue)
        setQuery({
            ...query,
            [optionName]: queryValue,
        })

        setFilterReset(true)
    }

    const handleLimitDropdownChange = (
        optionName: string,
        optionValue: string,
        queryValue: string
    ) => {
        setLimitSelected(optionValue)
        setQuery({
            ...query,
            [optionName]: queryValue,
        })

        setFilterReset(true)
    }

    const handleFileFormatDropdownChange = (
        optionName: string,
        optionValue: string,
        queryValue: string
    ) => {
        setFileFormatSelected(optionValue)
        setQuery({
            ...query,
            [optionName]: queryValue,
        })

        setFilterReset(true)
    }

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNameFilter(e.target.value)
        setQuery({
            ...query,
            name: e.target.value,
        })
    }

    const handleResetFilters = () => {
        setSortSelected('Newest')
        setLimitSelected('10')
        setFileFormatSelected('')
        setNameFilter('')
        setQuery({
            sort: 'desc',
            limit: 10,
        })
        setFilterReset(false)
    }
    return (
        <div className={`${className}`} >
            <div className="nameFilter">
                <EntryText
                    id="name"
                    label="Name"
                    name="name"
                    type="text"
                    value={nameFilter}
                    onChange={handleTextInputChange}
                />
                <Button onClick={() => {
                    formatQuery()
                    setFilterReset(true)
                }}>Search</Button>
            </div>
            <div className="filters">
                <div className="sortFilter">
                    <EntryDropdown
                        id="sort"
                        objectKey="sort"
                        label="Sort"
                        options={sortFilters}
                        setSelected={handleFilterDropdownChange}
                        selected={sortSelected}
                    />
                </div>
                <div className="limitFilter">
                    <EntryDropdown
                        id="limit"
                        objectKey="limit"
                        label="Limit"
                        options={limitFilters}
                        setSelected={handleLimitDropdownChange}
                        selected={limitSelected}
                    />
                </div>
                <div className="fileFormatFilters">
                    <EntryDropdown
                        id="fileFormat"
                        objectKey="fileformat"
                        label="File Format"
                        options={fileFormatFilters}
                        setSelected={handleFileFormatDropdownChange}
                        selected={fileFormatSelected}
                    />
                </div>
                {filterReset ? (
                    <button
                        className="filterReset"
                        onClick={() => handleResetFilters()}
                    >
                        <Icon name="filter_alt_off" />{' '}
                    </button>
                ) : null}
            </div>
        </div>
    )
}